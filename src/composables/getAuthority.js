import { ref } from "vue";
import { db } from "@/firebase/config";
import { collection, where, query, getDocs } from "firebase/firestore";

const getAuthority = async (uid) => {
  const authority = ref("");

  await getDocs(query(collection(db, "users"), where("uid", "==", uid))).then(
    (snap) => {
      snap.forEach((doc) => {
        authority.value = doc.data().position;
      });
    }
  );

  return { authority };
};

export default getAuthority;
