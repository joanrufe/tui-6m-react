import reactToWebComponent from "react-to-webcomponent";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import l10n from "@tuicom/l10n";
import translations from "./l10n/translations.json";
l10n(translations);

const AppComponent = reactToWebComponent(App, React, ReactDOM);
customElements.define("app", AppComponent);

export class Tui6mTutorialComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.addEventListener("click", ev => {
      let rect = ev.target.getBoundingClientRect();

      tuiCottonBall.publish(
        "tutorial-component",
        this.getAttribute("scope") || "*",
        "click",
        { xPos: ev.clientX - rect.left, yPos: ev.clientY - rect.top }
      );
    });
    tuiCottonBall.subscribe(
      "tutorial-component",
      this.getAttribute("scope") || "*",
      "background.change",
      (componentName, scope, eventName, data) => {
        this.style.backgroundColor = data.color;
      }
    );
  }

  loadRandomNumber() {
    const xhr = new XMLHttpRequest(),
      shadow = this.shadow; // must be reassigned due to closure scope

    xhr.addEventListener("load", function() {
      shadow.innerHTML += ` ${JSON.parse(this.response).value}`;
    });

    xhr.addEventListener("error", error => console.error(error));

    xhr.open("GET", middlelayerUrl);
    xhr.send();
  }

  static get observedAttributes() {
    return ["locale", "scope", "level"];
  }

  connectedCallback() {
    this.shadow.innerHTML = "<app></app>";
    this.loadRandomNumber();
  }
}

let assetsUrl = "__TUI_6M_ASSETS_URL__",
  middlelayerUrl = "__TUI_6M_MIDDLELAYER_URL__";

// development fallback
if (assetsUrl.indexOf("__") === 0) {
  assetsUrl = "http://localhost:3000";
  middlelayerUrl = "http://localhost:3500";
}

customElements.define("tui-6m-tutorial-component", Tui6mTutorialComponent);
