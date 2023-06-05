<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, reactive, ref } from 'vue';
import { useSelectLocationStore } from 'stores/selectLocation';
import { ProvincesInfo, RegenciesInfo } from 'components/models'
import { ValidationRule } from 'quasar';


const props = defineProps({
  isEdit: Boolean,
})

interface ProvinceInfo {
  id: number,
  name: string
}

interface RegencyInfo {
  id: number,
  province_id: number,
  name: string
}
interface DistrictInfo {
  id: number,
  regency_id: number,
  name: string
}

const loadingSelectProvinces = ref(false);
const loadingSelectRegencies = ref(false);
const loadingSelectDistricts = ref(false);

const showSelectRegencies = ref(false);
const showSelectDistricts = ref(false);
const locationStore = useSelectLocationStore();

const provinces = reactive<ProvincesInfo[]>([]);
const regencies = reactive<RegenciesInfo[]>([]);
const districts = reactive<DistrictInfo[]>([]);

const selectLocationStore = useSelectLocationStore();

onMounted(async () => {
  locationStore.removeLocationValues();
  try {
    const repsonseProvinces = await api.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
    provinces.splice(0, provinces.length, ...repsonseProvinces.data.map((province: ProvinceInfo) => {
      return {
        id: province.id,
        name: province.name,
        value: province.id, // Set the desired value for the value property
        label: province.name // Set the desired value for the label property
      };
    }));
    loadingSelectProvinces.value = false;
  } catch (error) {
    throw error
  } finally {
    loadingSelectProvinces.value = false;
  }

})

const getRegencies = async () => {
  loadingSelectRegencies.value = true;
  locationStore.removeLocationValues();
  if (selectLocationStore.$state.province !== null) {
    showSelectRegencies.value = true;
    try {
      const responseRegencies = await api.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectLocationStore.$state.province?.id}.json`)
      regencies.splice(0, regencies.length, ...responseRegencies.data.map((regency: RegencyInfo) => {
        return {
          id: regency.id,
          name: regency.name,
          value: regency.id, // Set the desired value for the value property
          label: regency.name // Set the desired value for the label property
        };
      }));
    } catch (error) {
      throw error;
    } finally {
      loadingSelectRegencies.value = false;
    }
  }
}

const getDistricts = async () => {
  loadingSelectDistricts.value = true;
  if (selectLocationStore.$state.regency !== null) {
    showSelectDistricts.value = true;
    try {
      const responseDistricts = await api.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectLocationStore.$state.regency?.id}.json`)
      districts.splice(0, districts.length, ...responseDistricts.data.map((district: DistrictInfo) => {
        return {
          id: district.id,
          name: district.name,
          value: district.id, // Set the desired value for the value property
          label: district.name // Set the desired value for the label property
        };
      }));
    } catch (error) {
      throw error;
    } finally {
      loadingSelectDistricts.value = false;
    }
  }
}

const optionsProvinces = ref(provinces)
const filterFnProvinces = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      optionsProvinces.value = provinces;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsProvinces.value = provinces.filter(
      (provincy) => provincy.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const optionsRegencies = ref(regencies);
const filterFnRegencies = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      optionsRegencies.value = regencies;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsRegencies.value = regencies.filter(
      (regency) => regency.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const optionsDistricts = ref(districts);
const filterFnDistricts = (val: string, update: (callback: () => void) => void) => {
  if (val === '') {
    update(() => {
      optionsDistricts.value = districts;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    optionsDistricts.value = districts.filter(
      (district) => district.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const myRule: ValidationRule = (value) => {
  if (props.isEdit) {
    return true;
  }
  return !!value || 'Pilih salah satu opsi';

};
</script>

<template>
  <q-select :loading="loadingSelectProvinces" filled v-model="selectLocationStore.province" use-input input-debounce="0"
    @filter="filterFnProvinces" @update:model-value="getRegencies" behavior="dialog" :options="optionsProvinces"
    label="Provinsi" :rules="[myRule]">
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
  <q-select v-if="showSelectRegencies" :loading="loadingSelectRegencies" filled v-model="selectLocationStore.regency"
    use-input input-debounce="0" @filter="filterFnRegencies" @update:model-value="getDistricts" behavior="dialog"
    :options="optionsRegencies" label="Kabupaten / Kota" :rules="[val => !!val || 'Pilih salah satu opsi']">
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
  <q-select v-if="showSelectDistricts" :loading="loadingSelectDistricts" filled v-model="selectLocationStore.district"
    use-input input-debounce="0" @filter="filterFnDistricts" behavior="dialog" :options="optionsDistricts"
    label="Kecamatan" :rules="[val => !!val || 'Pilih salah satu opsi']">
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
