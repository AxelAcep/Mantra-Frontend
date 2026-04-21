import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState, useCallback, useEffect } from 'react'
import {
    getAllUsers,
    createUser,
    editUser,
    deleteUser,
    getAllPegawai,
    getMe,
    requestForgotPassword,
    resetPassword,
    type CreateUserPayload,
    type EditUserPayload,
} from "../services/user.services"
import { toast } from "sonner"

export function useUsers(page = 1, limit = 10, search = "") {
    return useQuery({
        queryKey: ["users", page, limit, search],
        queryFn: () => getAllUsers(page, limit, search),
    })
}

export function useCreateUser(onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateUserPayload) => createUser(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] })
            toast.success("Akun berhasil dibuat.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useEditUser(onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: EditUserPayload }) =>
            editUser(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] })
            toast.success("Data berhasil diperbarui.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useDeleteUser() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["users"] })
            toast.success("User berhasil dihapus.")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useMe() {
    const query = useQuery({
        queryKey: ["me"],
        queryFn: getMe,
        staleTime: 1000 * 60 * 5, // 5 menit
    })

    useEffect(() => {
        if (query.data?.user) {
            localStorage.setItem("user", JSON.stringify(query.data.user))
        }
    }, [query.data])

    return query
}

export const usePegawai = () => {
  const [pegawai, setPegawai] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPegawai = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAllPegawai()
      setPegawai(response.data) // asumsikan response { data: [...] }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetch pegawai:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPegawai()
  }, [fetchPegawai])

  return { 
    pegawai, 
    loading, 
    error, 
    refetch: fetchPegawai 
  }
}

export function useForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestToken = async (email: string) => {
        setIsLoading(true);
        try {
            const res = await requestForgotPassword(email);
            toast.success(res.message);
            return true;
        } catch (error: any) {
            toast.error(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (payload: { 
        token: string, 
        password_baru: string, 
        konfirmasi_password: string 
    }) => {
        setIsLoading(true);
        try {
            const res = await resetPassword(payload);
            toast.success(res.message);
            return true;
        } catch (error: any) {
            toast.error(error.message);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { handleRequestToken, handleResetPassword, isLoading };
}