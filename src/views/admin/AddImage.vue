<template>
  <div class="row">
    <div class="col s12 m12 l12">
      <div class="card grey lighten-2">
        <div class="card-content">
          <span class="card-title">Sergiye Resim Ekle</span>
          <form @submit.prevent="addImage">
            <select v-model="selectExhibition">
              <option value="" disabled selected>Choose Exhibition</option>
              <option
                v-for="exhibition in exhibitions"
                :key="exhibition.id"
                :value="exhibition.exhibitionName"
              >
                <span class="red-text">{{ exhibition.exhibitionName }}</span>
              </option>
            </select>
            <input class="input-field" placeholder="Image Name" />
            <input class="input-field" placeholder="Artist Name" />
            <div class="file-field input-field">
              <div class="btn red lighten-2">
                <span>File</span>
                <input type="file" @change="uploadImage" />
              </div>
              <div class="file-path-wrapper">
                <input
                  type="text"
                  class="file-path validate"
                  placeholder="Choose of Image File"
                />
              </div>
            </div>
            <div class="progress red lighten-3" v-if="check">
              <div
                class="determinate red darken-2"
                :style="progressStyle"
              ></div>
            </div>
            <div class="center-align">
              <button class="btn red darken-3 btn-large">
                Add Picture in Exhibition
              </button>
            </div>
            <p class="red-text">{{ fileHata }}</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, onUpdated } from "vue";
  import { db, storageRef } from "@/firebase/config";
  import { query, collection, onSnapshot, where } from "firebase/firestore";
  import { ref as Ref, uploadBytesResumable } from "firebase/storage";

  export default {
    setup() {
      const selectExhibition = ref("");
      const exhibitions = ref([]);
      const check = ref(false);
      const fileTypes = ref(["image/png", "image/jpeg"]);
      const imageFile = ref(null);
      const fileHata = ref(null);
      const progressStyle = ref("width:0%");

      onMounted(async () => {
        const res = query(
          collection(db, "exhibitions"),
          where("activity", "==", true)
        );

        onSnapshot(res, (snap) => {
          exhibitions.value = [];
          snap.docs.forEach((doc) => {
            exhibitions.value.push({ ...doc.data(), id: doc.id });
          });
        });

        // var el = document.querySelectorAll("select");
        // M.FormSelect.init(el, {});
      });

      onUpdated(() => {
        M.AutoInit();
        //  console.log(selectExhibition.value);
      });

      const addImage = async () => {
        if (fileHata.value == null) {
          check.value = true;

          const storage = Ref(storageRef, `images/${M.guid()}`);

          uploadBytesResumable(storage, imageFile.value).on(
            "state_changed",
            (snap) => {
              const progress = (snap.bytesTransferred / snap.totalBytes) * 100;

              progressStyle.value = `width:${progress}%`;
            },
            (err) => {
              fileHata.value = "uploadBytesResumable";
            },
            async () => {
              setTimeout(() => {
                check.value = false;
                fileHata.value = "Image Upload";
              }, 500);
            }
          );
        }
      };
      const uploadImage = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile && fileTypes.value.includes(selectedFile.type)) {
          imageFile.value = selectedFile;
          fileHata.value = null;
        } else {
          fileHata.value = "File should be png or jpeg";
        }
      };

      return {
        selectExhibition,
        exhibitions,
        check,
        progressStyle,
        fileHata,
        addImage,
        uploadImage,
      };
    },
  };
</script>

<style scoped>
  ::placeholder {
    color: #636e72;
    opacity: 1;
  }
</style>
