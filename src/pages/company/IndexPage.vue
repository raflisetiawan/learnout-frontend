<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-md-4 q-mx-md">
        <q-card class="my-card bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Manage Pekerjaan</div>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle2">jumlah pekerjaan yang di posting: 0</div>
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn flat :to="{ name: 'CreateJob' }">Posting Pekerjaan</q-btn>
            <q-btn flat :to="{ name: 'ListJob' }">List Postingan Pekerjaan</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-md-4 q-mx-md">
        <q-card class="my-card bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Manage Profil Perusahaan</div>
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn flat>Lihat Profil</q-btn>
            <q-btn flat>Edit Profil</q-btn>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </div>
</template>
