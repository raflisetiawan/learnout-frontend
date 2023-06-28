<template>
  <div class="q-pa-md">
    <div class="row justify-around">
      <div class="col-md-4 q-pa-md">
        <q-card class="my-card bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Manage Universitas</div>
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn flat :to="{ name: 'CreateUniversity' }">Tambah Universitas</q-btn>
            <q-btn flat :to="{ name: 'Universities' }">List Universitas</q-btn>
            <!-- <q-btn flat>Action 2</q-btn> -->
          </q-card-actions>
        </q-card>

      </div>
      <div class="col-md-4 q-pa-md">
        <q-card class="my-card bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Manage Categories</div>
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn flat :to="{ name: 'CreateCategory' }">Tambah Category</q-btn>
            <q-btn flat :to="{ name: 'Categories' }">List Category</q-btn>
            <!-- <q-btn flat>Action 2</q-btn> -->
          </q-card-actions>
        </q-card>

      </div>
      <div class="col-md-4 q-pa-md">
        <q-card class="my-card bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Manage Contact</div>
          </q-card-section>

          <q-separator dark />

          <q-card-actions>
            <q-btn flat :to="{ name: 'AdminContact' }">List Pengirm Pesan</q-btn>
            <!-- <q-btn flat>Action 2</q-btn> -->
          </q-card-actions>
        </q-card>

      </div>
    </div>
  </div>
</template>
