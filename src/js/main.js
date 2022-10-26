"use strict";

//Alpine JS and plugins import
import Alpine from "alpinejs";
import intersect from "@alpinejs/intersect";
import persist from "@alpinejs/persist";

window.Alpine = Alpine;
//Init intersect plugin
Alpine.plugin(intersect);
//Init persist plugin
Alpine.plugin(persist);
//Init store
Alpine.store("app", {
  isSiderbarOpen: Alpine.$persist(false),
});
//Start Alpine JS
Alpine.start();

import { initPageLoader } from "./libs/components/pageloader/pageloader";
import { insertBgImages, initModals } from "./libs/utils/utils";
import "./libs/components";

const feather = require("feather-icons");

const showPageloader = initPageLoader();

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    //Switch backgrounds
    const changeBackgrounds = insertBgImages();

    //Feather Icons
    const featherIcons = feather.replace();

    // Add modal windows
    const modals = initModals();
  }
};
