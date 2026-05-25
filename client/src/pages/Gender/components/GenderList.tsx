import { useCallback, useEffect, useState, type FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import GenderService from "../../../services/GenderService";
import Spinner from "../../../components/Spinner/Spinner";
import { Link } from "react-router-dom";

interface GenderColumns {
  gender_id: number
  gender: string
}

interface GenderListProps {
  refreshKey: boolean;
}

const GenderList: FC<GenderListProps> = ({ refreshKey }) => {

  const [loadingGender, setLoadingGender] = useState(false)
  const [genders, setGenders] = useState<GenderColumns[]>([]);

  const handleLoadGenders = useCallback(async () => {
    try {
      setLoadingGender(true)

      const res = await GenderService.loadGenders()

      if (res.status === 200) {
        setGenders(res.data.genders)
      } else {
        console.error('Unexpected error status occurred during loading genders:', res.status)
      }
    } catch (error) {
      console.error('Unexpected server error occurred during loading genders:', error)
    } finally {
      setLoadingGender(false)
    }
  }, [])

  useEffect(() => {
    void handleLoadGenders()
  }, [refreshKey, handleLoadGenders])

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-teal-100 bg-white">
        <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-teal-200 bg-teal-700 sticky top-0 text-white text-xs">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  No.
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Gender
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Action
                </TableCell>

              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-teal-50 text-gray-600 text-sm">
              {loadingGender ? (
                <TableRow>
                  <TableCell className="px-4 py-3 text-center" colSpan={3}>
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                genders.map((gender, index) => (
                  <TableRow className="hover:bg-teal-50" key={index}>
                    <TableCell className="px-4 py-3 text-center">{index + 1}</TableCell>
                    <TableCell className="px-4 py-3 text-start">{gender.gender}</TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex justify-center items-center">
                        <Link to={`/gender/edit/${gender.gender_id}`} className="text-teal-700 font-medium hover:underline">
                          Edit
                        </Link>
                        <span className="px-2 text-teal-200">|</span>
                        <Link to={`/gender/delete/${gender.gender_id}`} className="text-red-600 font-medium hover:underline">
                          Delete
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>
      </div>
    </>
  );
};

export default GenderList;