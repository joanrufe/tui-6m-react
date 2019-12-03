// import reactToWebComponent from "react-to-webcomponent";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import L10n from "@tuicom/l10n/l10n"
import translations from "./l10n/translations.json"

const l10n = new L10n(translations, "fr-FR");

export class Tui6mComponent extends HTMLElement {
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

    const css = require("!!raw-loader!tui-components/lib/globals/global.css");
    const head = document.querySelector('head');
    const style = document.createElement('style');
    style.innerHTML = css.default;
    head.appendChild(style);
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
    ReactDOM.render(<App />, this.shadow)

    const styles = document.querySelector('#tui-styles style') || document.querySelector('head link[href="/main.css"]');

    if (process.env.NODE_ENV === "development" && styles) {
      this.shadow.appendChild(styles);
    } else {
      const link = document.createElement('link');
      link.id   = 'tui-styles';
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = `${assetsUrl}/main.css`;
      link.media = 'all';
      this.shadow.appendChild(link);
    }
  }
}

let assetsUrl = "__TUI_6M_ASSETS_URL__",
  middlelayerUrl = "__TUI_6M_MIDDLELAYER_URL__";

// development fallback
if (assetsUrl.indexOf("__") === 0) {
  assetsUrl = "http://localhost:3000";
  middlelayerUrl = "http://localhost:3500";
}

customElements.define("tui-6m-component", Tui6mComponent);
