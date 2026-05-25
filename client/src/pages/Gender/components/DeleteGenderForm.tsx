import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import GenderService from "../../../services/GenderService";
import Spinner from "../../../components/Spinner/Spinner";

const DeleteGenderForm = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState("");
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { gender_id: genderId } = useParams();

  const handleGetGender = useCallback(async (id: string | number) => {
    try {
      setLoadingGet(true);
      const res = await GenderService.getGender(id);
      if (res.status === 200 && res.data.gender) {
        setGender(res.data.gender.gender);
      } else {
        navigate("/gender", {
          state: { toastMessage: "Gender record not found." },
        });
      }
    } catch (error) {
      console.error("Unexpected server error occurred during getting gender:", error);
      navigate("/gender", {
        state: { toastMessage: "Unable to load selected gender." },
      });
    } finally {
      setLoadingGet(false);
    }
  }, [navigate]);

  const handleDeleteGender = async (e: FormEvent) => {
    e.preventDefault();
    if (!genderId) return;

    try {
      setLoadingDelete(true);
      const res = await GenderService.deleteGender(genderId);
      if (res.status === 200) {
        navigate("/gender", {
          state: { toastMessage: res.data?.message ?? "Gender Successfully Deleted." },
        });
      }
    } catch (error) {
      console.error("Unexpected server error occurred during deleting gender:", error);
      navigate("/gender", {
        state: { toastMessage: "Unable to delete selected gender." },
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    if (genderId) {
      void handleGetGender(genderId);
    } else {
      console.error("Missing gender_id in delete page query string.");
      navigate("/gender", {
        state: { toastMessage: "Missing gender id." },
      });
    }
  }, [genderId, handleGetGender, navigate]);

  return (
   <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
      <form onSubmit={handleDeleteGender}>
        <div className="mb-4">
          <FloatingLabelInput label="Gender" type="text" name="gender" value={gender} readonly />
        </div>

        <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/gender"/>
          <SubmitButton
            label="Delete Gender"
            loading={loadingDelete}
            loadinglabel="Deleting Gender..."
            newClassName="px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
          />
        </div>
      </form>
      )}
    
    </>
  )
}

export default DeleteGenderForm