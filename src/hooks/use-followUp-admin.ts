import { useState, useEffect } from "react";
import {
  getPegawaiAdminProyek,
  assignAdminProyek,
  type PegawaiAdminProyekOption,
} from "@/services/follow-up.services";

export function useFollowUpAdmin(followUpId: string) {
  const [pegawaiList, setPegawaiList] = useState<PegawaiAdminProyekOption[]>(
    [],
  );
  const [loadingPegawai, setLoadingPegawai] = useState(false);
  const [errorPegawai, setErrorPegawai] = useState<string | null>(null);

  const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);
  const [errorAssign, setErrorAssign] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingPegawai(true);
    setErrorPegawai(null);

    getPegawaiAdminProyek()
      .then((data) => {
        if (active) setPegawaiList(data);
      })
      .catch((err) => {
        if (active)
          setErrorPegawai(err.message ?? "Gagal mengambil data pegawai.");
      })
      .finally(() => {
        if (active) setLoadingPegawai(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleAssign() {
    if (!selectedPegawaiId) {
      setErrorAssign("Pilih pegawai terlebih dahulu.");
      return;
    }

    setAssigning(true);
    setErrorAssign(null);
    setAssignSuccess(false);

    try {
      await assignAdminProyek({ followUpId, pegawaiId: selectedPegawaiId });
      setAssignSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorAssign(err.message ?? "Gagal menugaskan Admin Proyek.");
    } finally {
      setAssigning(false);
    }
  }

  return {
    pegawaiList,
    loadingPegawai,
    errorPegawai,
    selectedPegawaiId,
    setSelectedPegawaiId,
    assigning,
    errorAssign,
    assignSuccess,
    handleAssign,
  };
}
