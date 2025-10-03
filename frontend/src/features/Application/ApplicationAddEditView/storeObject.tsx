import { makeAutoObservable, runInAction, toJS } from "mobx";
import { validate } from "./validObject";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  findAddresses,
  getAllStreets, getOneStreet,
  getAteChildren, getAteStreets, searchStreet,
  getDistricts,
  getTundukDistricts
} from "../../../api/District/useGetDistricts";
import { getTags } from "api/Tag/useGetTags";
import { getDarek, getSearchDarek } from "../../../api/SearchMap/useGetDarek";
import { ArchObject, ArchObjectValues } from "constants/ArchObject";
import { getArchObjectsByAppId } from "api/ArchObject/useGetArchObjects";
import PopupApplicationStore from "../PopupAplicationListView/store";
import axios from "axios";
import { API_KEY_2GIS } from "../../../constants/config";
import { TUNDUK_TO_REGULAR_DISTRICT_MAP, getRegularDistrictId } from "constants/constant";

class NewStore {
  app_id = 0;
  id = 0;
  xcoordinate = 0;
  ycoordinate = 0;
  description = '';
  geometry = [];
  point = [];
  Districts = []
  TundukDistricts = [];
  TundukResidentialAreas = [];
  TundukStreets = [];
  SearchResults = [];
  Tags = []
  tags = []
  arch_objects: ArchObjectValues[] = []
  counts: number[] = [];
  loading = [false];
  legalRecords = false;

  TundukStreetsSearchCache = new Map(); // Кэш результатов поиска
  tundukStreetStates = new Map(); // Map для хранения состояний по индексу
  searchTimers = new Map(); // Таймеры для debounce


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.xcoordinate = 0;
      this.ycoordinate = 0;
      this.description = '';
      this.Districts = [];
      this.TundukDistricts = [];
      this.TundukResidentialAreas = [];
      this.Tags = [];
      this.tags = [];
      this.point = [];
      this.arch_objects = [];
      this.app_id = 0;
      this.tundukStreetStates = new Map();
      this.TundukStreetsSearchCache = new Map(); // Кэш результатов поиска
      this.searchTimers = new Map(); // Таймеры для debounce
    });
  }

  handleChangeLoading(i) {
    runInAction(() => {
      this.loading[i] = !this.loading[i];
    })
  }

  handleChange(event, index: number) {
    this.arch_objects[index][event.target.name] = event.target.value;
    validate(event, index);
  }

  debounceTimeoutRef: NodeJS.Timeout | null = null;

  updateObject<K extends keyof ArchObjectValues>(objectId: number, field: K, value: ArchObjectValues[K]) {
    const object = this.arch_objects.find((obj) => obj.id === objectId);
    if (object) {
      object[field] = value;

      if (field === 'address') {
        if (this.debounceTimeoutRef) {
          clearTimeout(this.debounceTimeoutRef);
        }
        this.debounceTimeoutRef = setTimeout(() => {
          this.searchBuildings(value as string);
        }, 500);
      }
    }
  }

  activeObjectId: number | null = null;

  setActiveObjectId(id: number | null) {
    this.activeObjectId = id;
  }

  searchResults: any[] = [];
  isListOpen = false;

  setSearchResults = (results: any[]) => {
    this.searchResults = results;
  };

  setIsListOpen = (val: boolean) => {
    this.isListOpen = val;
  };

  handleItemClick = (objectId: number, result: any) => {
    this.setIsListOpen(false);

    const object = this.arch_objects.find(obj => obj.id === objectId);
    if (!object) return;

    const districtName = result.adm_div?.find((d: any) => d.type === "district")?.name;
    const district = this.Districts.find(d => d.name === districtName);
    const districtId = district?.id ?? null;

    object.district_id = Number(districtId);
    object.address = result.address_name;
    object.ycoordinate = result.point?.lon;
    object.xcoordinate = result.point?.lat;
  };

  searchBuildings = async (query: string) => {
    if (!query) {
      this.setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get('https://catalog.api.2gis.com/3.0/items', {
        params: {
          q: query,
          point: '74.60,42.87',
          radius: 10000,
          key: API_KEY_2GIS,
          fields: 'items.point,items.address_name,items.adm_div',
        },
      });

      const results = response.data.result.items.filter(i => i.address_name != null) || [];
      this.setSearchResults(results);
      this.setIsListOpen(true);
    } catch (error) {
      console.error(i18n.t("object.error.searchError"), error);
    }
  };

  handleChangeField(event) {
    this[event.target.name] = event.target.value;
  }

  setCoords(x: number, y: number) {
    this.xcoordinate = x
    this.ycoordinate = y
  }

  setBadgeConst(index) {
    runInAction(async () => {
      this.counts[index] = await PopupApplicationStore.loadApplications(this.arch_objects[index].address, () => this.handleChangeLoading(index))
    })
  }
  onSaveClick = () => {
    let canSave = true;
    this.arch_objects.forEach((x, i) => {
      let event: { target: { name: string; value: any } } = { target: { name: "address", value: x.address } };
      canSave = validate(event, i) && canSave;
      event = { target: { name: "district_id", value: x.district_id } };
      canSave = validate(event, i) && canSave;
      event = { target: { name: "tags", value: this.tags } };
      canSave = validate(event, i) && canSave;
      x.tags = this.tags;
      x.description = this.description;

    })
    return { canSave, data: this.arch_objects };
  };

  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        let districts = response.data
        this.Districts = districts
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTundukDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTundukDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TundukDistricts = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadAteChildrens = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getAteChildren(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TundukResidentialAreas = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadStreets = async (id?: number) => {
    try {
      MainStore.changeLoader(true);
      const response = id && id > 0 ? await getAteStreets(id) : await getAllStreets();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TundukStreets = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };



  // Инициализация состояния для конкретного индекса
  initTundukStreetState = (index) => {
    if (!this.tundukStreetStates.has(index)) {
      this.tundukStreetStates.set(index, {
        inputValue: '',
        selectedStreet: null,
        isOpen: false,
        searchResults: [],
        isLoading: false
      });
    }
    return this.tundukStreetStates.get(index);
  };

  // Получение состояния для индекса
  getTundukStreetState = (index) => {
    return this.tundukStreetStates.get(index) || this.initTundukStreetState(index);
  };

  // Debounced поиск для конкретного поля
  debouncedSearchTundukStreets = (index, searchQuery) => {
    // Очищаем предыдущий таймер для этого индекса
    if (this.searchTimers.has(index)) {
      clearTimeout(this.searchTimers.get(index));
    }

    // Если запрос короче 2 символов, очищаем результаты
    if (!searchQuery || searchQuery.trim().length < 2) {
      const state = this.getTundukStreetState(index);
      runInAction(() => {
        state.searchResults = [];
        state.isLoading = false;
      });
      return;
    }

    // Устанавливаем новый таймер
    const timer = setTimeout(() => {
      this.searchTundukStreets(index, searchQuery);
    }, 300);

    this.searchTimers.set(index, timer);
  };


  handleTundukStreetChangeWithDistrictUpdate = async (index, newValue) => {
    const state = this.getTundukStreetState(index);

    if (typeof newValue === 'object' && newValue?.id) {
      runInAction(() => {
        state.selectedStreet = newValue;
      });

      // Обновляем tunduk_street_id
      this.handleChange({
        target: {
          name: "tunduk_street_id",
          value: newValue.id
        }
      }, index);

      // Автоматически устанавливаем район и микрорайон на основе выбранной улицы
      if (newValue && newValue.address_unit_id) {
        try {
          // Сначала пытаемся найти микрорайон
          const residentialArea = this.TundukResidentialAreas.find(x => x.id == newValue.address_unit_id);

          if (residentialArea) {
            // Если это микрорайон, устанавливаем его
            this.handleChange({
              target: {
                name: "tunduk_address_unit_id",
                value: residentialArea.id
              }
            }, index);

            // Также устанавливаем родительский район для микрорайона
            if (residentialArea.parent_id) {
              this.handleChange({
                target: {
                  name: "tunduk_district_id",
                  value: residentialArea.parent_id
                }
              }, index);

              // АВТОМАТИЧЕСКИ УСТАНАВЛИВАЕМ ОБЫЧНЫЙ РАЙОН
              this.handleChange({
                target: {
                  name: "district_id",
                  value: getRegularDistrictId(residentialArea.parent_id)
                }
              }, index);
            }
          } else {
            // Если не микрорайон, проверяем, может это район
            const district = this.TundukDistricts.find(x => x.id == newValue.address_unit_id);

            if (district) {
              this.handleChange({
                target: {
                  name: "tunduk_district_id",
                  value: district.id
                }
              }, index);

              // АВТОМАТИЧЕСКИ УСТАНАВЛИВАЕМ ОБЫЧНЫЙ РАЙОН
              this.handleChange({
                target: {
                  name: "district_id",
                  value: getRegularDistrictId(district.id)
                }
              }, index);

              // Загружаем микрорайоны для этого района
              await this.loadAteChildrens(district.id);

              // Сбрасываем микрорайон
              this.handleChange({
                target: {
                  name: "tunduk_address_unit_id",
                  value: 0
                }
              }, index);
            }
          }
        } catch (error) {
          console.error('Ошибка при установке района для улицы:', error);
        }
      }
    } else {
      runInAction(() => {
        state.selectedStreet = null;
      });

      // Сбрасываем tunduk_street_id
      this.handleChange({
        target: {
          name: "tunduk_street_id",
          value: 0
        }
      }, index);

      // Сбрасываем обычный район на "Не определено"
      this.handleChange({
        target: {
          name: "district_id",
          value: this.Districts.find(item => item.code === 'not defined')?.id || 6
        }
      }, index);
    }
  };

  // Замените существующий метод searchTundukStreets в файле storeObject.tsx на этот:

  // Метод для поиска улиц с учетом выбранного района/микрорайона
  searchTundukStreets = async (index, searchQuery) => {
    const state = this.getTundukStreetState(index);

    // Игнорируем запросы короче 2 символов
    if (!searchQuery || searchQuery.trim().length < 2) {
      runInAction(() => {
        state.searchResults = [];
        state.isLoading = false;
      });
      return;
    }

    // Формируем ключ кэша с учетом района и микрорайона
    const districtId = this.arch_objects[index]?.tunduk_district_id ?? 0;
    const addressUnitId = this.arch_objects[index]?.tunduk_address_unit_id ?? 0;
    const cacheKey = `${searchQuery.toLowerCase().trim()}_${districtId}_${addressUnitId}`;

    // Проверяем кэш
    if (this.TundukStreetsSearchCache.has(cacheKey)) {
      runInAction(() => {
        state.searchResults = this.TundukStreetsSearchCache.get(cacheKey);
        state.isLoading = false;
      });
      return;
    }

    runInAction(() => {
      state.isLoading = true;
    });

    try {
      MainStore.changeLoader(true);

      // Определяем ID для фильтрации
      // Приоритет: микрорайон > район
      let filterAteId = 0;

      if (this.arch_objects[index]?.tunduk_address_unit_id) {
        // Если выбран микрорайон, используем его
        filterAteId = this.arch_objects[index].tunduk_address_unit_id;
      } else if (this.arch_objects[index]?.tunduk_district_id) {
        // Если выбран только район, используем его
        filterAteId = this.arch_objects[index].tunduk_district_id;
      }
      // Если ничего не выбрано (filterAteId = 0), API вернет все улицы

      const response = await searchStreet(searchQuery, filterAteId);

      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          // Фильтруем результаты на клиенте для дополнительной проверки
          let filteredResults = response.data;

          // Если выбран район или микрорайон, дополнительно фильтруем результаты
          if (filterAteId > 0) {
            filteredResults = response.data.filter(street => {
              // Проверяем, что улица принадлежит выбранному району/микрорайону
              return street.address_unit_id === filterAteId ||
                street.parent_address_unit_id === filterAteId;
            });
          }

          state.searchResults = filteredResults;
          state.isLoading = false;

          // Сохраняем в кэш
          this.TundukStreetsSearchCache.set(cacheKey, filteredResults);
        });
      } else {
        throw new Error();
      }

    } catch (error) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      runInAction(() => {
        state.searchResults = [];
        state.isLoading = false;
      });
    } finally {
      MainStore.changeLoader(false);
    }
  };


  handleTundukDistrictChange = (index, districtId) => {
    // Устанавливаем район Tunduk
    this.handleChange({
      target: {
        name: "tunduk_district_id",
        value: districtId
      }
    }, index);

    // АВТОМАТИЧЕСКИ УСТАНАВЛИВАЕМ ОБЫЧНЫЙ РАЙОН
    if (districtId) {
      this.handleChange({
        target: {
          name: "district_id",
          value: getRegularDistrictId(districtId)
        }
      }, index);
    } else {
      // Если район не выбран, ставим "Не определено"
      this.handleChange({
        target: {
          name: "district_id",
          value: this.Districts.find(item => item.code === 'not defined')?.id || 6
        }
      }, index);
    }
  };
  // Метод для загрузки улицы по ID
  loadTundukStreetById = async (index, streetId) => {
    if (!streetId) return null;

    const state = this.getTundukStreetState(index);

    try {

      const response = await getOneStreet(streetId);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const street = response.data;

        runInAction(() => {
          // Устанавливаем выбранную улицу
          state.selectedStreet = street;
          state.inputValue = `${street.name || ''} (${street.address_unit_name}) ${street.id}`;

          // Добавляем в результаты поиска, если её там нет
          const exists = state.searchResults.find(s => s.id === street.id);
          if (!exists) {
            state.searchResults = [street, ...state.searchResults];
          }
        });
        return street;

      } else {
        throw new Error();
      }



    } catch (error) {
      console.error('Ошибка загрузки улицы:', error);
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      return null;
    }
  };

  // Обработчик изменения текста в поле ввода
  handleTundukStreetInputChange = (index, newInputValue, reason, objIndex) => {
    const state = this.getTundukStreetState(index);

    runInAction(() => {
      state.inputValue = newInputValue;
    });

    // Запускаем поиск только если пользователь вводит текст
    if (reason === 'input') {
      if (newInputValue.length >= 2) {
        this.debouncedSearchTundukStreets(index, newInputValue);
      } else {
        // Очищаем результаты если меньше 2 символов
        runInAction(() => {
          state.searchResults = [];
        });
      }
    }
  };

  // Обработчик выбора значения
  handleTundukStreetChange = (index, newValue, objIndex) => {
    const state = this.getTundukStreetState(index);

    if (typeof newValue === 'object' && newValue?.id) {
      runInAction(() => {
        state.selectedStreet = newValue;
      });

      // Обновляем tunduk_street_id
      this.handleChange({
        target: {
          name: "tunduk_street_id",
          value: newValue.id
        }
      }, objIndex);

      // Обновляем район если есть улица
      if (newValue && newValue.address_unit_id) {
        const district = this.TundukDistricts.find(x => x.id == newValue.address_unit_id);
        if (district) {
          this.handleChange({
            target: {
              name: "tunduk_district_id",
              value: district.id
            }
          }, objIndex);
        }
      }
    } else {
      runInAction(() => {
        state.selectedStreet = null;
      });

      // Сбрасываем tunduk_street_id
      this.handleChange({
        target: {
          name: "tunduk_street_id",
          value: 0
        }
      }, objIndex);
    }
  };

  // Обработчик открытия dropdown
  handleTundukStreetOpen = (index) => {
    const state = this.getTundukStreetState(index);

    runInAction(() => {
      state.isOpen = true;
    });

    // Загружаем результаты при открытии, если есть текст
    if (state.inputValue && state.inputValue.length >= 2) {
      this.searchTundukStreets(index, state.inputValue);
    }
  };

  // Обработчик закрытия dropdown
  handleTundukStreetClose = (index) => {
    const state = this.getTundukStreetState(index);

    runInAction(() => {
      state.isOpen = false;
    });
  };

  // Очистка состояния для индекса (при размонтировании компонента)
  clearTundukStreetState = (index) => {
    if (this.searchTimers.has(index)) {
      clearTimeout(this.searchTimers.get(index));
      this.searchTimers.delete(index);
    }
    this.tundukStreetStates.delete(index);
  };

  // Очистка всех состояний
  clearAllTundukStreetStates = () => {
    this.searchTimers.forEach(timer => clearTimeout(timer));
    this.searchTimers.clear();
    this.tundukStreetStates.clear();
  };

  // Очистка кэша (можно вызывать при необходимости)
  clearTundukStreetsCache = () => {
    this.TundukStreetsSearchCache.clear();
  };




  findAddresses = async (i: number) => {
    try {
      const state = this.getTundukStreetState(i);
      if (!state?.selectedStreet?.streetId) {
        MainStore.setSnackbar("Выберите улицу", "error");
        return;
      }
      MainStore.changeLoader(true);
      // let selectedStreetId = this.TundukStreets.find(x => x.id == this.arch_objects[i].tunduk_street_id)?.streetId ?? 0;

      const response = await findAddresses(state?.selectedStreet?.streetId, this.arch_objects[i].tunduk_building_num, this.arch_objects[i].tunduk_flat_num, this.arch_objects[i].tunduk_uch_num);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.SearchResults = response.data.list
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  searchFromDarek = async (eni: string, index: number) => {
    try {
      MainStore.changeLoader(true);
      if (eni.length >= 13) {
        eni = eni.substring(0, 15)
      } else {
        return
      }
      const response = await getDarek(eni);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // this.address = response.data.address;
        // this.identifier = response.data.propcode.toString() ?? '';
        this.arch_objects[index].geometry = JSON.parse(response.data.geometry);
        if (this.arch_objects[index].geometry.length > 0) {
          this.arch_objects[index].xcoordinate = this.arch_objects[index].geometry[0][0];
          this.arch_objects[index].ycoordinate = this.arch_objects[index].geometry[0][1];
        }
        const [street = "", house = "", apartment = ""] =
          (response.data.address ?? "")
            .split(",")
            .map(part => part.trim());
        this.arch_objects[index].address = response.data.address;
        this.arch_objects[index].street = street;
        this.arch_objects[index].house = house;
        this.arch_objects[index].apartment = apartment;
        this.arch_objects[index].addressInfo = response.data.info;
        this.geometry = this.arch_objects[index].geometry
        // this.geometry = JSON.parse(response.data.geometry);
        // this.addressInfo = response.data.info;
      } else if (response.status === 204) {
        this.arch_objects[index].address = '';
        this.arch_objects[index].identifier = '';
        this.arch_objects[index].geometry = [];
        this.arch_objects[index].addressInfo = [];
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "error");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  getSearchListFromDarek = async (propcode: string, index: number) => {
    try {
      // var propcode = "1-02-03-0006-0003-01"
      const response = await getSearchDarek(propcode);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.arch_objects[index].DarekSearchList = response.data;
        if (response.data?.length === 1) {
          this.handleChange({ target: { value: [], name: "DarekSearchList" } }, index)
          this.searchFromDarek(response.data[0]?.propcode ?? "", index);
        }
        // this.address = response.data.address;
        // this.identifier = response.data.propcode.toString() ?? '';
        // this.geometry = JSON.parse(response.data.geometry);
        // this.addressInfo = response.data.info;
      } else if (response.status === 204) {
        // this.address = '';
        // this.identifier = '';
        // this.geometry = [];
        // this.addressInfo = [];
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  loadArchObjects = async (app_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjectsByAppId(app_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(async () => {
          this.arch_objects = response.data

          this.arch_objects.forEach((obj, i) => {
            this.initTundukStreetState(i);
            // Если есть выбранный ID, загружаем улицу
            if (obj.tunduk_street_id) {
              this.loadTundukStreetById(i, obj.tunduk_street_id);
            }
          });

          this.tags = response.data[0]?.tags
          this.description = response.data[0]?.description

          this.arch_objects.forEach((arch, index) => {
            const [street = "", house = "", apartment = ""] =
              (arch.address ?? "")
                .split(",")
                .map(part => part.trim());

            this.arch_objects[index].street = street;
            this.arch_objects[index].house = house;
            this.arch_objects[index].apartment = apartment;
          });

          this.counts = await Promise.all(this.arch_objects.map(async (arch, i) =>
            await PopupApplicationStore.loadApplications(arch.address, () => this.handleChangeLoading(i))))
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Tags = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  changeTags(ids: number[]) {
    this.tags = ids;
  }

  deleteAddress(i: number) {
    this.arch_objects.splice(i, 1);
    this.counts.splice(i, 1);
  }


  newAddressClicked() {
    const defaultDistrictId = this.Districts.find(item => item.code === 'not defined')?.id || 6;

    this.arch_objects = [...this.arch_objects, {
      id: (this.arch_objects.length + 1) * -1,
      address: "",
      name: "",
      identifier: "",
      district_id: defaultDistrictId, // Используем переменную
      tunduk_district_id: 0,
      xcoordinate: null,
      ycoordinate: null,
      description: "",
      name_kg: "",
      tags: [],
      geometry: [],
      addressInfo: [],
      point: [],
      DarekSearchList: [],
      errordistrict_id: "",
      errordescription: "",
      errortunduk_district_id: "",
      erroraddress: "",
      open: false,
      is_manual: false,
      tunduk_address_unit_id: 0,
      tunduk_street_id: 0,
      tunduk_building_id: null,
      tunduk_building_num: '',
      tunduk_flat_num: '',
      tunduk_uch_num: ''
    }]
  }

  async loadDictionaries() {
    this.loadTags()
    await this.loadDistricts()
    await this.loadTundukDistricts()
    // await this.loadStreets()
  }

  async doLoad(app_id: number) {
    this.clearStore();
    await this.loadDictionaries();
    if (app_id == null || app_id == 0) {
      const defaultDistrictId = this.Districts.find(item => item.code === 'not defined')?.id || 6;


      this.arch_objects = [{
        id: (this.arch_objects.length + 1) * -1,
        address: "",
        name: "",
        identifier: "",
        district_id: defaultDistrictId, // Используем переменную
        tunduk_district_id: 0,
        xcoordinate: null,
        ycoordinate: null,
        description: "",
        name_kg: "",
        tags: [],
        geometry: [],
        addressInfo: [],
        point: [],
        DarekSearchList: [],
        errordistrict_id: "",
        errortunduk_district_id: "",
        errordescription: "",
        erroraddress: "",
        open: false,
        is_manual: false,
        tunduk_address_unit_id: 0,
        tunduk_street_id: 0,
        tunduk_building_id: null,
        tunduk_building_num: '',
        tunduk_flat_num: '',
        tunduk_uch_num: '',
        random_key: (Math.random() + 1).toString(36).substring(5)
      }]
      return;
    }
    this.app_id = app_id;
    this.loadArchObjects(app_id);
  }
}

// Добавьте этот метод в класс NewStore в файле storeObject.tsx

// Обработчик изменения улицы с автоматической установкой района


export default new NewStore();
