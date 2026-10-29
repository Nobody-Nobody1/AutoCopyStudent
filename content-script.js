(function () {
  "use strict";

  const VIEW_ONLY_LABELS = new Set([
    "Students can view file",
    "Students can view the file"
  ]);
  const COPY_LABEL = "Make a copy for each student";
  const MENU_ITEM_SELECTOR = '[role="menuitem"], [role="option"], [role="menuitemradio"]';
  const processedControls = new WeakSet();
  let scanScheduled = false;

  function normalizeText(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function isVisible(element) {
    const style = window.getComputedStyle(element);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
    );
  }

  function getClickableAncestor(element) {
    return (
      element.closest(
        'button, [role="button"], [role="menuitem"], [role="option"], [role="menuitemradio"]'
      ) || element
    );
  }

  function findExactText(text, selector = "*") {
    return Array.from(document.querySelectorAll(selector))
      .filter((element) => isVisible(element))
      .filter((element) => normalizeText(element.textContent || "") === text)
      .sort((a, b) => a.children.length - b.children.length);
  }

  function selectCopyOption() {
    const option = findExactText(COPY_LABEL, MENU_ITEM_SELECTOR)[0];
    if (option) {
      getClickableAncestor(option).click();
      scheduleScan();
      return true;
    }

    return false;
  }

  function updateSharingControl(control) {
    if (processedControls.has(control)) {
      return;
    }

    processedControls.add(control);
    getClickableAncestor(control).click();

    let attempts = 0;
    const trySelectingCopyOption = () => {
      attempts += 1;
      if (!selectCopyOption() && attempts < 20) {
        window.setTimeout(trySelectingCopyOption, 100);
      }
    };

    window.setTimeout(trySelectingCopyOption, 0);
  }

  function scanForSharingControls() {
    scanScheduled = false;

    for (const label of VIEW_ONLY_LABELS) {
      for (const element of findExactText(label)) {
        if (element.closest(MENU_ITEM_SELECTOR)) {
          continue;
        }

        updateSharingControl(element);
        return;
      }
    }
  }

  function scheduleScan() {
    if (scanScheduled) {
      return;
    }

    scanScheduled = true;
    window.requestAnimationFrame(scanForSharingControls);
  }

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  scheduleScan();
})();