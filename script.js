// Select all navbar links
const navLinks = document.querySelectorAll('.nav-link');

// Add click event to each link
navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    const sectionID = link.getAttribute('href'); // Get the target section ID
    const section = document.querySelector(sectionID);

    if (section) {
      // Scroll to the target section smoothly
      section.scrollIntoView({ behavior: 'smooth' });
      
      // Display a message in the console
      console.log(`Navigated to ${sectionID}`);
    }
  });
});
