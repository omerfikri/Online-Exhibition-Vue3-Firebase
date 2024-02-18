<template>
  <div class="row">
    <div class="col m12 s12">
      <div class="card grey lighten-1">
        <div class="card-content white-text">
          <span clas="card-title black-text">Personal Informations</span>
          <table class="responsive-table centered">
            <tbody>
              <tr>
                <td class="black-test">
                  <img :src="imageURL" height="50" />
                </td>
                <td class="black-test">{{ userName }}</td>
                <td class="black-test">{{ email }}</td>
                <td class="black-test">{{ position }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col m6 s6">
      <div class="card grey lighten-1">
        <div class="card-content white-text">
          <span class="card-title black-text">Message to Admin</span>
          <form @submit.prevent="sendMessage">
            <input type="text" class="input-field" v-model="messageText" />
            <button class="btn black">Send</button>
          </form>
        </div>
      </div>
    </div>
    <div class="col m6 s6">
      <div class="card grey lighten-1">
        <div class="card-content white-text">
          <span class="card-title black-text">Personal Informations</span>
          <ul class="collection">
            <li
              class="collection-item black-text"
              v-for="message in messages"
              :key="message"
            >
              <div>
                {{ message.message }}
                <a href="#" class="secondary-content">
                  <i
                    class="fas fa-trash red-text"
                    @click="deleteMessage(message.id)"
                  ></i>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { onMounted, ref } from "vue";
  import getUser from "@/composables/getUser";
  import { db, timestamp } from "@/firebase/config";
  import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
    updateDoc,
    doc,
  } from "firebase/firestore";
  export default {
    setup() {
      const imageURL = ref("");
      const email = ref("");
      const userName = ref("");
      const position = ref("");
      const messageText = ref("");
      const messages = ref([]);

      const { kullanici } = getUser();
      const uid = kullanici.value.uid;

      onMounted(async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uid));
        const snapshot = await getDocs(q);

        snapshot.forEach((doc) => {
          imageURL.value = doc.data().photoURL;
          email.value = doc.data().email;
          userName.value = doc.data().userName;
          position.value = doc.data().position;
        });

        const q1 = query(
          collection(db, "messages"),
          where("to", "==", uid),
          where("activity", "==", true)
        );
        onSnapshot(q1, (snap) => {
          messages.value = [];
          snap.forEach((doc) => {
            messages.value.push({ ...doc.data(), id: doc.id });
          });
        });
      });

      const sendMessage = async () => {
        if (messageText.value != "") {
          console.log(messageText.value);
          const newMessage = {
            message: messageText.value,
            from: uid,
            to: "admin",
            createdDate: timestamp,
            activity: true,
          };
          await addDoc(collection(db, "messages"), newMessage).then(() => {
            messageText.value = "";
          });
        }
      };

      const deleteMessage = async (id) => {
        const updateMessage = doc(db, "messages", id);
        await updateDoc(updateMessage, {
          activity: false,
        });
      };
      return {
        imageURL,
        email,
        userName,
        position,
        messageText,
        messages,
        sendMessage,
        deleteMessage,
      };
    },
  };
</script>

<style></style>
