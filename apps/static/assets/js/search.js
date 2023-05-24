function searchElements(searchTerm, elements) {
    var matchedElements = [];
    
    Array.from(elements).forEach(function(element) {
      var text = element.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        matchedElements.push(element);
      }
    });
    
    return matchedElements;
  }
  