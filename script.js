document.addEventListener("DOMContentLoaded", () => {
  console.log("DEBUG: DOMContentLoaded - GSAP initialized for interactive text with advanced hover effects.");

  const interactiveTextSection = document.getElementById("interactive-text-section");
  const textElements = document.querySelectorAll(".interactive-text");
  const headingElement = document.querySelector('#interactive-text-section h2');
  const lastStanzaWrapper = document.getElementById('last-stanza-wrapper');
  const bodyElement = document.body;

  console.log("DEBUG: Elements selected - interactiveTextSection:", interactiveTextSection, "textElements count:", textElements.length, "headingElement:", headingElement, "lastStanzaWrapper:", lastStanzaWrapper, "bodyElement:", bodyElement);

  let originalBodyBgColor = 'rgb(244, 244, 244)'; 
  let originalHeadingColor = 'rgb(51, 51, 51)';   
  let originalInteractiveTextColor = 'rgb(44, 62, 80)'; 

  if (bodyElement) {
    originalBodyBgColor = window.getComputedStyle(bodyElement).backgroundColor;
    console.log("DEBUG: Original body background color:", originalBodyBgColor);
  }
  if (headingElement) {
    originalHeadingColor = window.getComputedStyle(headingElement).color;
    console.log("DEBUG: Original heading color:", originalHeadingColor);
  }

  if (interactiveTextSection && textElements.length > 0) {
    const allLetters = [];
    const parasiteLetterSpans = [];
    const targetWord = "parasite";
    console.log("DEBUG: Initializing character span creation. Target word for hover:", targetWord);

    textElements.forEach((textElement, pIndex) => {
      const paragraphText = textElement.textContent;
      console.log(`DEBUG: Processing paragraph ${pIndex}: "${paragraphText}"`);
      textElement.innerHTML = ""; 
      
      // Simpler check for "parasite" within each paragraph's text content
      let searchIndex = 0;
      let foundParasiteInParagraph = false;
      
      while(paragraphText.toLowerCase().indexOf(targetWord, searchIndex) !== -1 && !foundParasiteInParagraph) {
          // This simplified logic only flags if the word exists, not its exact spans for now
          // The previous complex span-by-span check was likely the issue.
          // We'll refine how parasiteLetterSpans are populated if this block works.
          let startIndex = paragraphText.toLowerCase().indexOf(targetWord, searchIndex);
          if (startIndex !== -1) {
              console.log(`DEBUG: Found "${targetWord}" in paragraph ${pIndex} at index ${startIndex}`);
              // For now, we are not populating parasiteLetterSpans here to simplify.
              // We will add this back once base functionality is confirmed.
              searchIndex = startIndex + targetWord.length; // Continue search after this instance
              foundParasiteInParagraph = true; // Mark as found for this paragraph
          } else {
              break; // No more occurrences
          }
      }


      for (let i = 0; i < paragraphText.length; i++) {
        const char = paragraphText[i];
        const span = document.createElement("span");

        if (char === " " || char === "\u00A0") {
          span.innerHTML = "&nbsp;";
        } else {
          span.textContent = char;
        }
        textElement.appendChild(span);
        allLetters.push(span);

        if (i === 0 && pIndex === 0 && allLetters.length === 1) { // Get original text color from the very first created span
             try {
                originalInteractiveTextColor = window.getComputedStyle(span).color;
                console.log("DEBUG: Original interactive text color:", originalInteractiveTextColor, "from span:", span);
             } catch (e) {
                console.warn("DEBUG: Could not get computed style for interactive text color.", e);
             }
        }
        
        // Simplified check for populating parasiteLetterSpans
        // This needs to be robust: check if the current span is part of "parasite"
        // For now, let's assume paragraphText is where "it is parasite yet it is me" is
        if (textElement.textContent.includes("it is parasite yet it is me")) { // Very specific check
            const specificLine = "it is parasite yet it is me";
            const parasiteIndexInSpecificLine = specificLine.indexOf(targetWord);
            if (parasiteIndexInSpecificLine !== -1 && 
                paragraphText === specificLine && // Ensure it's THIS specific paragraph
                i >= parasiteIndexInSpecificLine && 
                i < parasiteIndexInSpecificLine + targetWord.length) {
                parasiteLetterSpans.push(span);
                span.classList.add('debug-parasite-letter'); // Visual aid
            }
        }
      }
    });
    console.log("DEBUG: Total interactive letter spans created:", allLetters.length);
    console.log("DEBUG: Identified 'parasite' letter spans count:", parasiteLetterSpans.length, parasiteLetterSpans);
    if(parasiteLetterSpans.length > 0) {
        console.log("DEBUG: 'parasite' letter spans:", parasiteLetterSpans.map(s => s.textContent).join(''));
    }


    // "parasite" word hover effect
    if (parasiteLetterSpans.length > 0) {
      console.log("DEBUG: Attaching hover listeners to 'parasite' letter spans.");
      parasiteLetterSpans.forEach((pSpan, index) => {
        pSpan.addEventListener('mouseenter', () => {
          console.log(`DEBUG: Mouse ENTER on 'parasite' letter span ${index}: "${pSpan.textContent}"`);
          gsap.to(parasiteLetterSpans, { 
            color: "red", 
            duration: 0.2, 
            overwrite: "auto" 
          });
        });
        pSpan.addEventListener('mouseleave', () => {
          console.log(`DEBUG: Mouse LEAVE on 'parasite' letter span ${index}: "${pSpan.textContent}"`);
          gsap.to(parasiteLetterSpans, { 
            color: originalInteractiveTextColor, 
            duration: 0.2, 
            overwrite: "auto" 
          });
        });
      });
    } else {
        console.log("DEBUG: No 'parasite' letter spans found to attach listeners to.");
    }

    // Last stanza hover effect
    if (lastStanzaWrapper && headingElement && bodyElement) {
      console.log("DEBUG: Attaching hover listeners to #last-stanza-wrapper.");
      lastStanzaWrapper.addEventListener('mouseenter', () => {
        console.log("DEBUG: Mouse ENTER on #last-stanza-wrapper.");
        gsap.to(bodyElement, { backgroundColor: "#000000", duration: 0.5, overwrite: "auto" });
        gsap.to(headingElement, { color: "#FFFFFF", duration: 0.5, overwrite: "auto" });
        if (allLetters.length > 0) {
           gsap.to(allLetters, { color: "#FFFFFF", duration: 0.5, overwrite: "auto", stagger: 0.005 });
        }
      });

      lastStanzaWrapper.addEventListener('mouseleave', () => {
        console.log("DEBUG: Mouse LEAVE on #last-stanza-wrapper.");
        gsap.to(bodyElement, { backgroundColor: originalBodyBgColor, duration: 0.5, overwrite: "auto" });
        gsap.to(headingElement, { color: originalHeadingColor, duration: 0.5, overwrite: "auto" });
         if (allLetters.length > 0) {
            // Revert all letters to their originalInteractiveTextColor.
            // The parasite hover effect will override if its own mouseenter is active.
            gsap.to(allLetters, { color: originalInteractiveTextColor, duration: 0.5, overwrite: "auto", stagger: 0.005 });
        }
      });
    } else {
        console.log("DEBUG: Could not attach listeners for last stanza effect. Missing elements:");
        if (!lastStanzaWrapper) console.log("DEBUG: - #last-stanza-wrapper");
        if (!headingElement) console.log("DEBUG: - headingElement (h2)");
        if (!bodyElement) console.log("DEBUG: - bodyElement");
    }

    // Original interactive text scattering effect
    const interactionRadius = 100; 
    const pushStrength = 80;   
    const pushDuration = 0.1;
    const returnDuration = 0.7;
    console.log("DEBUG: Text scattering effect params - radius:", interactionRadius, "strength:", pushStrength, "pushDur:", pushDuration, "returnDur:", returnDuration);

    interactiveTextSection.addEventListener("mousemove", (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      allLetters.forEach((letter) => {
        const letterRect = letter.getBoundingClientRect();
        if (letterRect.width === 0 && letterRect.height === 0 && letter.textContent.trim() === '' && letter.innerHTML !== '&nbsp;') {
            return; 
        }
        
        const letterCenterX = letterRect.left + letterRect.width / 2;
        const letterCenterY = letterRect.top + letterRect.height / 2;
        const deltaX = mouseX - letterCenterX;
        const deltaY = mouseY - letterCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < interactionRadius) {
          const angle = Math.atan2(deltaY, deltaX);
          const force = (1 - distance / interactionRadius) * pushStrength;
          const targetX = Math.cos(angle) * -force;
          const targetY = Math.sin(angle) * -force;

          gsap.to(letter, {
            x: targetX,
            y: targetY,
            duration: pushDuration, 
            ease: "power2.out",
            overwrite: true,
          });
        } else {
          gsap.to(letter, {
            x: 0,
            y: 0,
            duration: returnDuration, 
            ease: "elastic.out(1, 0.4)",
            overwrite: true, 
          });
        }
      });
    });

    interactiveTextSection.addEventListener("mouseleave", () => {
    //   console.log("DEBUG: Mouse LEAVE on #interactive-text-section.");
      allLetters.forEach((letter) => {
        gsap.to(letter, {
          x: 0,
          y: 0,
          duration: returnDuration,
          ease: "elastic.out(1, 0.4)",
          overwrite: true,
        });
      });
    });

  } else {
    console.log("DEBUG: Initial conditions not met for interactive text setup.");
    if (!interactiveTextSection) {
      console.warn("DEBUG: Interactive text section ('#interactive-text-section') not found.");
    }
    if (textElements.length === 0) {
      console.warn("DEBUG: No interactive text elements ('.interactive-text') found.");
    }
  }
});
