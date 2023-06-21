<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStudentStore } from 'src/stores/student';
import { useUserStore } from 'src/stores/user';
import { api } from 'src/boot/axios';
import { useRouter } from 'vue-router';

const studentStore = useStudentStore();
const userStore = useUserStore();
const bar = ref();
const studentId = ref();
const resume = ref('Daftar Riwayat Hidup');
const loading = ref(false);
const router = useRouter();

if (!studentStore.$state.studentId) {
  onMounted(async () => {
    try {
      bar.value.start();
      const response = await api.get(`students/getOneStudentByUserId/${userStore.$state.userId}`);
      studentId.value = response.data.student.id;
      if (response.data.student.resume !== null) resume.value = response.data.student.resume;
    } catch (error) {
      throw error;
    } finally {
      bar.value.stop();
    }
  })
} else {
  onMounted(async () => {
    try {
      bar.value.start();
      const response = await api.get(`students/${studentStore.$state.studentId}`);
      studentId.value = response.data.data.id;
      if (response.data.data.resume !== null) resume.value = response.data.data.resume;
    } catch (error) {
      throw error
    } finally {
      bar.value.stop();
    }
  })
}

const onSubmit = async () => {
  try {
    loading.value = true;
    await api.patch(`/students/updateResumeStudent/${studentId.value}`, { resume: resume.value });
    router.push({ name: 'MyProfile' });
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
}

</script>
<template>
  <div>
    <q-ajax-bar ref="bar" color="primary" position="top" size="5px" skip-hijack />
    <div class="q-pa-md">
      <div class="text-h4">Buat Daftar Riwayat Hidup</div>
      <div class="row">
        <div class="col-md-9">
          <q-form @submit="onSubmit" class=" q-gutter-md">
            <q-editor v-model="resume" :dense="$q.screen.lt.md" :toolbar="[
              [
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify']
                },
                {
                  label: $q.lang.editor.align,
                  icon: $q.iconSet.editor.align,
                  fixedLabel: true,
                  options: ['left', 'center', 'right', 'justify']
                }
              ],
              ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
              ['token', 'hr', 'link', 'custom_btn'],
              ['print', 'fullscreen'],
              [
                {
                  label: $q.lang.editor.formatting,
                  icon: $q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: $q.lang.editor.fontSize,
                  icon: $q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
                {
                  label: $q.lang.editor.defaultFont,
                  icon: $q.iconSet.editor.font,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                  ]
                },
                'removeFormat'
              ],
              ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

              ['undo', 'redo'],
              ['viewsource']
            ]" :fonts="{
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}" />
            <div>
              <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
            </div>
          </q-form>

        </div>
      </div>
    </div>
  </div>
</template>
