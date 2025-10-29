import { useEffect, useState } from "react";
import { getOwners } from "../../owners/api/owners.api";
import { getAllUsers } from "../../users/api/users.api";
import { getPetsByOwnerId, getPetById } from "../../pets/api/pets.api";

/**
 * Handles async loading of vets, owners, and pets for the appointment form.
 * Ensures all IDs are strings for consistent form validation with Zod.
 */
export const useAppointmentFormData = (initialValues) => {
  const [owners, setOwners] = useState([]);
  const [vets, setVets] = useState([]);
  const [pets, setPets] = useState([]);
  const [loadingPreset, setLoadingPreset] = useState(false);

  // Load veterinarians and owners (convert IDs to strings)
  useEffect(() => {
    (async () => {
      try {
        const [ownersData, vetsData] = await Promise.all([
          getOwners(),
          getAllUsers(),
        ]);

        const mappedOwners = (ownersData?.content || ownersData || []).map(
          (o) => ({
            ...o,
            id: String(o.id),
          })
        );

        const mappedVets = (vetsData?.content || vetsData || []).map((v) => ({
          ...v,
          id: String(v.id),
        }));

        setOwners(mappedOwners);
        setVets(mappedVets);
      } catch (error) {
        console.error("Error loading owners or vets:", error);
      }
    })();
  }, []);

  // Load pets when selecting an owner (convert IDs to strings)
  useEffect(() => {
    if (initialValues?.ownerId) {
      (async () => {
        try {
          const petList = await getPetsByOwnerId(initialValues.ownerId);
          const mappedPets = (petList || []).map((p) => ({
            ...p,
            id: String(p.id),
          }));
          setPets(mappedPets);
        } catch (error) {
          console.error("Error loading pets:", error);
        }
      })();
    }
  }, [initialValues?.ownerId]);

  // Load prefilled pet (if petId param exists in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const petId = params.get("petId");

    if (petId) {
      setLoadingPreset(true);
      (async () => {
        try {
          const pet = await getPetById(petId);
          const petList = await getPetsByOwnerId(pet.ownerId);

          const mappedPets = (petList || []).map((p) => ({
            ...p,
            id: String(p.id),
          }));

          setPets(mappedPets);
        } catch (error) {
          console.error("Error loading preset pet:", error);
        } finally {
          setLoadingPreset(false);
        }
      })();
    }
  }, []);

  return { owners, vets, pets, loadingPreset, setPets };
};
