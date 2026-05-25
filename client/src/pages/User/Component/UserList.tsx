import { useCallback, useEffect, useState, type FC, type UIEvent } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table"
import UserService from "../../../services/UserService"
import Spinner from "../../../components/Spinner/Spinner"

interface UserlistProps {
    onAdduser: () => void
    onEditUser: (userId: number) => void
    onDeleteUser: (userId: number) => void
    refreshKey: boolean
}

interface UserRow {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix_name: string | null;
  profile_picture: string | null;
  gender_id: number | null;
  gender_name: string | null;
  birth_date: string;
  username: string;
}

const Userlist: FC<UserlistProps>= ({onAdduser, onEditUser, onDeleteUser, refreshKey}) => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLoadUsers = useCallback(async (nextPage = 1, append = false, search = "") => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res = await UserService.loadUsers(nextPage, search);
      if (res.status === 200) {
        const nextUsers = res.data.users ?? [];
        setUsers((prev) => (append ? [...prev, ...nextUsers] : nextUsers));
        setPage(res.data.current_page ?? nextPage);
        setHasMore(Boolean(res.data.has_more));
      }
    } catch (error) {
      console.error("Unexpected server error occurred during loading users:", error);
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void handleLoadUsers(1, false, searchTerm);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [handleLoadUsers, refreshKey, searchTerm]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (loading || loadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;

    if (isNearBottom) {
      void handleLoadUsers(page + 1, true, searchTerm);
    }
  };

  const getFullName = (user: UserRow) => {
    const middlePart = user.middle_name ? ` ${user.middle_name}` : "";
    const suffixPart = user.suffix_name ? ` ${user.suffix_name}` : "";
    return `${user.last_name}, ${user.first_name}${middlePart}${suffixPart}`.trim();
  };

  const getUserInitials = (user: UserRow) => {
    const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();
    return initials || "U";
  };

  const getProfilePictureUrl = (profilePicture: string | null) => {
    if (!profilePicture) return null;
    return `http://localhost/RNLDemo/server/public/${profilePicture}`;
  };

  const parseBirthDate = (birthDate: string) => {
    if (!birthDate) return null;

    const datePart = birthDate.split("T")[0];
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  };

  const getAge = (birthDate: string) => {
    const dob = parseBirthDate(birthDate);
    if (!dob) return "-";

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age -= 1;
    }

    return age >= 0 ? age : "-";
  };

  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return "-";

    const datePart = birthDate.split("T")[0];
    return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : birthDate;
  };

  return (
    <>
    <div className="overflow-hidden rounded-lg border border-teal-100 bg-white">
        <div
          className="max-w-full max-h-[calc(100vh-12rem)] overflow-auto"
          onScroll={handleScroll}
        >
          <Table>
            <caption>
                <div className="border-b border-teal-100">
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full max-w-xs">
                          <label htmlFor="user-search" className="mb-1 block text-xs font-medium text-teal-700">
                            Search
                          </label>
                          <input
                            id="user-search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Name, gender, age, birthday"
                            className="w-full rounded-lg border border-teal-300 px-3 py-2 text-sm text-gray-700 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                          />
                        </div>
                        <button
                          type="button"
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-lg transition cursor-pointer"
                          onClick={onAdduser}
                        >
                          Add User
                        </button>
                    </div>
                </div>
            </caption>

            <TableHeader className="border-b border-teal-200 bg-teal-700 sticky top-0 text-white text-xs">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  No.
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Full Name
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Gender
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Birth Date
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Age
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-teal-50 text-gray-600 text-sm">
              {loading ? (
                <TableRow>
                  <TableCell className="px-4 py-8 text-center" colSpan={6}>
                    <div className="flex justify-center">
                      <Spinner size="md" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-8 text-center" colSpan={6}>
                    No users found.
                  </TableCell>
                </TableRow>
              ) : users.map((user, index) => (
                <TableRow className="hover:bg-teal-50" key={index}>
                  <TableCell className="px-4 py-3 text-center">
                    {(page - 1) * 15 + index + 1}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-left">
                    <div className="flex items-center gap-4">
                      {getProfilePictureUrl(user.profile_picture) ? (
                        <img
                          src={getProfilePictureUrl(user.profile_picture) ?? ""}
                          alt={getFullName(user)}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-teal-200"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                          {getUserInitials(user)}
                        </div>
                      )}
                      <span>{getFullName(user)}</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    {user.gender_name || "-"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    {formatBirthDate(user.birth_date)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    {getAge(user.birth_date)}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        className="text-teal-700 font-medium cursor-pointer hover:underline"
                        onClick={() => onEditUser(user.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 font-medium cursor-pointer hover:underline"
                        onClick={() => onDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      </div>
      {users.length > 0 && loadingMore && (
        <div className="flex justify-center p-4 border-t border-teal-100 bg-white">
          <Spinner size="sm" />
        </div>
      )}
    </>
  )
}

export default Userlist