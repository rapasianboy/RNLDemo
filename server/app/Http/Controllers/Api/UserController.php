<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function loadUsers(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $users = User::leftJoin('tbl_genders', 'tbl_users.gender_id', '=', 'tbl_genders.gender_id')
            ->where('tbl_users.is_deleted', false)
            ->select('tbl_users.*', 'tbl_genders.gender as gender_name')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($nestedQuery) use ($search) {
                    $nestedQuery
                        ->whereRaw(
                            "CONCAT(tbl_users.last_name, ', ', tbl_users.first_name, COALESCE(CONCAT(' ', tbl_users.middle_name), ''), COALESCE(CONCAT(' ', tbl_users.suffix_name), '')) LIKE ?",
                            ["%{$search}%"]
                        )
                        ->orWhere('tbl_genders.gender', 'like', "%{$search}%")
                        ->orWhere('tbl_users.birth_date', 'like', "%{$search}%")
                        ->orWhereRaw(
                            'TIMESTAMPDIFF(YEAR, tbl_users.birth_date, CURDATE()) LIKE ?',
                            ["%{$search}%"]
                        );
                });
            })
            ->orderByDesc('tbl_users.id')
            ->paginate(15);

        return response()->json([
            'users' => $users->items(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'has_more' => $users->hasMorePages(),
            'total' => $users->total(),
            'search' => $search,
        ], 200);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:50'],
            'middle_name' => ['nullable', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'suffix_name' => ['nullable', 'string', 'max:20'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'gender_id' => ['required', 'integer', 'exists:tbl_genders,gender_id'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:tbl_users,username'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $profilePicturePath = null;

        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $fileName = uniqid('user_', true) . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/profile_pictures');

            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $fileName);
            $profilePicturePath = 'uploads/profile_pictures/' . $fileName;
        }

        User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'] ?? null,
            'profile_picture' => $profilePicturePath,
            'gender_id' => $validated['gender_id'],
            'birth_date' => $validated['birth_date'],
            'username' => $validated['username'],
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'User Successfully Saved.',
        ], 200);
    }

    public function getUser($userId)
    {
        $user = User::where('is_deleted', false)
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        return response()->json([
            'user' => $user,
        ], 200);
    }

    public function updateUser(Request $request, $userId)
    {
        $user = User::where('is_deleted', false)
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:50'],
            'middle_name' => ['nullable', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'suffix_name' => ['nullable', 'string', 'max:20'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'gender_id' => ['required', 'integer', 'exists:tbl_genders,gender_id'],
            'birth_date' => ['required', 'date'],
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:tbl_users,username,' . $user->id],
        ]);

        $removeProfilePicture = filter_var($request->input('remove_profile_picture', false), FILTER_VALIDATE_BOOLEAN);
        $profilePicturePath = $user->profile_picture;

        if ($removeProfilePicture && $user->profile_picture) {
            $existingPath = public_path($user->profile_picture);
            if (is_file($existingPath)) {
                @unlink($existingPath);
            }
            $profilePicturePath = null;
        }

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture) {
                $existingPath = public_path($user->profile_picture);
                if (is_file($existingPath)) {
                    @unlink($existingPath);
                }
            }

            $file = $request->file('profile_picture');
            $fileName = uniqid('user_', true) . '.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/profile_pictures');

            if (!is_dir($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $file->move($destinationPath, $fileName);
            $profilePicturePath = 'uploads/profile_pictures/' . $fileName;
        }

        $user->update([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'] ?? null,
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'] ?? null,
            'profile_picture' => $profilePicturePath,
            'gender_id' => $validated['gender_id'],
            'birth_date' => $validated['birth_date'],
            'username' => $validated['username'],
        ]);

        return response()->json([
            'message' => 'User Successfully Updated.',
        ], 200);
    }

    public function deleteUser($userId)
    {
        $user = User::where('is_deleted', false)
            ->find($userId);

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        $user->update([
            'is_deleted' => true,
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.',
        ], 200);
    }
}
