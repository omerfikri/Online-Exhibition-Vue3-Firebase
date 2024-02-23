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
                :value="exhibition.id"
              >
                <span class="red-text">{{ exhibition.exhibitionName }}</span>
              </option>
            </select>
            <input
              class="input-field"
              placeholder="Image Name"
              v-model="imageName"
            />
            <input
              class="input-field"
              placeholder="Artist Name"
              v-model="artistName"
            />
            <input
              class="input-field"
              placeholder="Image Order"
              type="number"
              v-model="imageOrder"
            />
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

  <div class="row">
    <div class="col s12 m12 l12">
      <div class="card grey lighten-2">
        <div class="card-content">
          <span class="card-title">Image List</span>

          <select v-model="selectExhibition">
            <option value="" disabled selected>Choose Exhibition</option>
            <option
              v-for="exhibition in exhibitions"
              :key="exhibition.id"
              :value="exhibition.id"
            >
              <span class="red-text">{{ exhibition.exhibitionName }}</span>
            </option>
          </select>
          <button class="btn orange darken-2" @click="loadImages">
            Load Images
          </button>
          <ul class="collection">
            <li class="collection-item" v-for="image in images" :key="image.id">
              <span class="title">
                {{ image.imageName }}
              </span>
              <a
                href="#modal1"
                @click="deleteImage(image.id)"
                class="secondary-content modal-trigger"
              >
                <i class="far fa-trash-alt red-text"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div id="modal1" class="modal" v-if="deleteAuthority == 'admin'">
    <div class="modal-content">
      <h4>Are You Sure Delete?</h4>
      <p>Explanition</p>
    </div>
    <div class="modal-footer">
      <a
        @click="delete1"
        href="#!"
        class="modal-close waves-effect waves-red btn-flat"
        >Yes</a
      >
      <a href="#!" class="modal-close waves-effect waves-green btn-flat">No</a>
    </div>
  </div>
  <div id="modal1" class="modal" v-else>
    <div class="modal-content">
      <h4>You Don't Have Authority</h4>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close waves-effect waves-green btn-flat"
        >Close</a
      >
    </div>
  </div>
</template>

<script>
  import { ref, onMounted, onUpdated } from "vue";
  import { db, storageRef, auth } from "@/firebase/config";
  import getAuthority from "@/composables/getAuthority";
  import {
    query,
    collection,
    onSnapshot,
    where,
    addDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  import {
    ref as Ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";

  export default {
    setup() {
      const selectExhibition = ref("");
      const exhibitions = ref([]);
      const check = ref(false);
      const fileTypes = ref(["image/png", "image/jpeg"]);
      const imageFile = ref(null);
      const fileHata = ref(null);
      const progressStyle = ref("width:0%");

      const imageName = ref("");
      const artistName = ref("");
      const imageURL = ref("");
      const imageOrder = ref(null);

      const images = ref([]);

      const deleteAuthority = ref("");
      const imageID = ref("");

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

        let kullanici = auth.currentUser;
        const { authority } = await getAuthority(kullanici.uid);
        deleteAuthority.value = authority.value;
      });

      onUpdated(() => {
        M.AutoInit();
        //  console.log(selectExhibition.value);
      });

      const addImage = async () => {
        if (fileHata.value == null) {
          const storage = Ref(storageRef, `images/${M.guid()}`);

          if (selectExhibition.value != "") {
            check.value = true;
            uploadBytesResumable(storage, imageFile.value).on(
              "state_changed",
              (snap) => {
                const progress =
                  (snap.bytesTransferred / snap.totalBytes) * 100;

                progressStyle.value = `width:${progress}%`;
              },
              (err) => {
                fileHata.value = "uploadBytesResumable";
              },
              async () => {
                setTimeout(async () => {
                  check.value = false;
                  fileHata.value = "Image Upload";

                  imageURL.value = await getDownloadURL(storage);
                  // console.log(
                  //   imageName.value,
                  //   artistName.value,
                  //   selectExhibition.value,
                  //   imageURL.value
                  // );
                  const image = {
                    exhibitionID: selectExhibition.value,
                    imageName: imageName.value,
                    artistName: artistName.value,
                    imageOrder: imageOrder.value,
                    imageURL: imageURL.value,
                  };

                  await addDoc(collection(db, "images"), image).then(
                    (element) => {
                      fileHata.value = `Added Image with ID ${element.id}`;
                      selectExhibition.value = "";
                      imageName.value = "";
                      artistName.value = "";
                      imageOrder.value = "";
                      imageFile.value = "";
                    }
                  );
                }, 500);
              }
            );
          } else {
            fileHata.value = "Image Not Upload Please Choose Exhibition";
          }
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

      const deleteImage = (id) => {
        imageID.value = id;
      };

      const loadImages = async () => {
        const res = query(
          collection(db, "images"),
          where("exhibitionID", "==", selectExhibition.value)
        );

        onSnapshot(res, (snap) => {
          images.value = [];
          snap.docs.forEach((doc) => {
            images.value.push({ ...doc.data(), id: doc.id });
          });
        });
      };

      const delete1 = async () => {
        const docRef = doc(db, "images", imageID.value);
        await deleteDoc(docRef);
      };

      return {
        selectExhibition,
        exhibitions,
        check,
        progressStyle,
        fileHata,
        imageURL,
        artistName,
        imageName,
        imageOrder,
        images,
        deleteAuthority,
        addImage,
        uploadImage,
        deleteImage,
        loadImages,
        delete1,
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
