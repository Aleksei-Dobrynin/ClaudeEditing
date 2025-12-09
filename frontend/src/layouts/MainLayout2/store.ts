import { makeAutoObservable, runInAction } from "mobx";

class NewStore {
  drawerOpened = true;

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      // this.drawerOpened = true;
    });
  }


  changeDrawer(){
    this.drawerOpened = !this.drawerOpened
  }

}

export default new NewStore();
