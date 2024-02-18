<template>
  <div class="row">
    <div class="col m6 s12">
      <div class="card grey lighten-1">
        <div class="card-content white-text">
          <span class="card-title black-text"> Messages </span>
          <ul class="collection">
            <li
              class="collection-item black-text"
              v-for="message in messages"
              :key="message"
            >
              <div>
                {{ message.message }}
                <a class="secondary-content">
                  <i
                    style="cursor: pointer"
                    class="fas fa-paper-plane brown-text"
                    @click="
                      showMessage(message.from, message.message, message.id)
                    "
                  ></i>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col m6 s12">
      <div class="card grey lighten-1">
        <div class="card-content white-text">
          <span class="card-title black-text"> Answer </span>
          <form @submit.prevent="sendMessage">
            <label class="white-text row">
              <span class="black-text">Who : </span>
              {{ userName }}
            </label>
            <label class="white-text row">
              <span class="black-text">Content : </span>
              {{ messageContent }}
            </label>
            <label class="black-text row">Reply</label>
            <input type="text" class="input-field" v-model="messageText" />
            <button class="btn black">Send</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { onMounted, ref } from "vue";
  import { db, timestamp } from "@/firebase/config";
  import {
    collection,
    where,
    query,
    getDocs,
    onSnapshot,
    updateDoc,
    doc,
  } from "firebase/firestore";
  export default {
    setup() {
      const messages = ref([]);
      const messageContent = ref("");
      const userName = ref("");
      const messageText = ref("");

      const userUID = ref("");
      const messageId = ref("");

      onMounted(async () => {
        const res = query(
          collection(db, "messages"),
          where("to", "==", "admin"),
          where("activity", "==", true)
        );
        onSnapshot(res, (snap) => {
          messages.value = [];
          snap.docs.forEach((doc) => {
            messages.value.push({ ...doc.data(), id: doc.id });
          });
        });
      });

      const showMessage = async (who, content, id) => {
        messageContent.value = content;
        messageId.value = id;

        const snap = await getDocs(
          query(collection(db, "users"), where("uid", "==", who))
        );

        snap.forEach((doc) => {
          userName.value = doc.data().userName;
          userUID.value = doc.data().uid;
        });
      };

      const sendMessage = async () => {
        if (userName.value != "") {
          const messageRef = doc(db, "messages", messageId.value);
          await updateDoc(messageRef, {
            to: userUID.value,
            from: "admin",
            message: messageText.value,
            createdDate: timestamp,
          }).then(() => {
            messageText.value = "";
            userName.value = "";
            messageContent.value = "";
          });
        } else {
          console.log("Message doesn't send");
        }
      };

      return {
        messages,
        messageContent,
        userName,
        messageText,
        showMessage,
        sendMessage,
      };
    },
  };
</script>

<style></style>
