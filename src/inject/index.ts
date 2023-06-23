(function () {
  const originOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function (_, url) {

    if (url.includes("/api/interface/get")) {
      this.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          const res = JSON.parse(this.responseText);
          window.postMessage({ type: "inject_message_type", message: res.data })
        }
      });
    }
    originOpen.apply(this, arguments);
  };

})()