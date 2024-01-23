// ==UserScript==
// @name         Google Docs Headings with Copy Icon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy anchorized headings in Google Docs
// @author       You
// @match        https://docs.google.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function setup() {
        let referenceElem = document.querySelector('.navigation-widget');

        // Check if the reference element exists
        if (referenceElem) {
            addCopyIconsToHeadings();
            createButton();
        } else {
            // If the element is not found, try again after a delay
            setTimeout(setup, 1000);
        }
    }

    setup(); // Call the function initially


    function createButton() {
        const topReference = document.querySelector('#docs-titlebar-share-client-button');
        let div = document.createElement('div');
        div.classList.add('b-button');
        div.setAttribute('style', 'cursor: pointer; background: #1a73e8; z-index: 99999; color: #fff; border: 0; border-radius: 4px; font-family: "Google Sans"; font-weight: 500; font-size: 14px; display: flex; justify-content: center; align-items: center; height: 36px; letter-spacing: 0.25px; line-height: 16px; padding: 0 24px; width: auto;');
        div.innerText = 'Update anchors';
        div.addEventListener('click', addCopyIconsToHeadings);
        topReference.insertAdjacentElement("afterEnd", div);
    }


    // Anchorize function similar to your Python logic
    function anchorizeString(inputString) {
        let anchorName = inputString.toLowerCase();

        // Replace spaces and special characters with hyphen
        anchorName = anchorName.replace(/[^a-z0-9-\u00C0-\u00FF]/g, "-");

        // Replace multiple consecutive hyphens with a single hyphen
        anchorName = anchorName.replace(/-+/g, "-");

        return anchorName.trim("-");
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    // Function to add icons and set up click events
    function addCopyIconsToHeadings() {

        console.log('ADD COPY ICONS CALLED');
        const headingElements = document.getElementsByClassName('navigation-item-content');

        for (const element of headingElements) {
            // Create an icon element (e.g., a simple text or an actual icon)
            let icon = document.createElement('div');
            icon.innerText = '🔗'; // Example: using a link emoji as the icon
            icon.style.cursor = 'pointer';
            icon.style.position = 'absolute';
            icon.style.right = '-13px';
            icon.style.top = '0px';
            icon.style.background = 'white';
            icon.style.padding = '0 0 0 6px';

            element.style.position = 'relative';

            element.parentElement.style.position = 'relative';

            // Append the icon to the heading element
            element.parentElement.appendChild(icon);

            // Set up the click event for the icon
            icon.addEventListener('mousedown', function(event) {
                event.preventDefault();
                event.stopPropagation();

                const anchorizedText = '#' + anchorizeString(element.textContent);
                copyToClipboard(anchorizedText);
            });


        }
    }

    // Run the function when the document is fully loaded
    // You might need to add a delay or observer if the content loads dynamically
    //document.addEventListener('DOMContentLoaded', addCopyIcons);

    //addCopyIcons();
})();
