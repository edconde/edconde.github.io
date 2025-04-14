document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar el tema primero para evitar parpadeos
    initializeTheme();
    
    // Inicializar el menú móvil
    initializeMobileMenu();

    const pathname = window.location.pathname;
    updateActiveNavLink(pathname);
    
    try {
        if (pathname.includes('portfolio.html')) {
            await loadProjects();
        } else if (pathname.includes('education.html')) {
            await loadEducation();
        } else if (pathname.includes('experience.html')) {
            await loadExperience();
        } else if (pathname.endsWith('index.html') || pathname.endsWith('/')) {
            await loadProfile();
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
});

function initializeMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    menuButton.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuButton.querySelector('i').classList.remove('fa-bars');
            menuButton.querySelector('i').classList.add('fa-times');
        } else {
            mobileMenu.classList.add('hidden');
            menuButton.querySelector('i').classList.remove('fa-times');
            menuButton.querySelector('i').classList.add('fa-bars');
        }
    });

    // Sincronizar el cambio de tema con el botón principal
    themeToggleMobile.addEventListener('click', () => {
        document.getElementById('theme-toggle').click();
        const isDark = document.documentElement.classList.contains('dark');
        themeToggleMobile.querySelector('i').classList.toggle('fa-sun', isDark);
        themeToggleMobile.querySelector('i').classList.toggle('fa-moon', !isDark);
    });
}

function updateActiveNavLink(pathname) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('text-gray-500', 'dark:text-gray-300', 'text-indigo-600', 'dark:text-indigo-400');
        const href = link.getAttribute('href');
        if (
            href === pathname.split('/').pop() ||
            (pathname.endsWith('/') && href === 'index.html') ||
            (pathname.endsWith('/src/') && href === 'index.html') ||
            (pathname === '/' && href === 'index.html')
        ) {
            link.classList.add('text-indigo-600', 'dark:text-indigo-400');
        } else {
            link.classList.add('text-gray-500', 'dark:text-gray-300');
        }
    });
}

async function loadExperience() {
    try {
        const response = await fetch('../data/experience.json');
        const data = await response.json();
        const container = document.getElementById('experience-container');

        data.experiences.forEach((exp, index) => {
            const experienceCard = `
                <div class="card p-6 rounded-lg shadow-md dark:bg-gray-800" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${exp.position}</h3>
                            <p class="text-indigo-700 dark:text-indigo-400 font-medium">${exp.company}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-800 dark:text-gray-200 font-medium">${exp.period}</p>
                            <p class="text-gray-700 dark:text-gray-300"><i class="fas fa-map-marker-alt mr-1"></i>${exp.location}</p>
                        </div>
                    </div>
                    <p class="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">${exp.description}</p>
                    <div class="mb-4">
                        <h4 class="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                            <i class="fas fa-tasks text-indigo-500 dark:text-indigo-400 mr-2"></i>Funciones principales:
                        </h4>
                        <ul class="list-disc pl-5 text-gray-800 dark:text-gray-300 space-y-1">
                            ${exp.funciones.map(funcion => `
                                <li class="flex items-start">
                                    <i class="fas fa-check-circle text-green-500 dark:text-green-400 mt-1 mr-2"></i>
                                    <span>${funcion}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${exp.technologies.map(tech => 
                            `<span class="tech-tag px-3 py-1 text-sm rounded-full">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', experienceCard);
        });
    } catch (error) {
        console.error('Error cargando la experiencia:', error);
    }
}

async function loadEducation() {
    try {
        const response = await fetch('../data/education.json');
        const data = await response.json();
        const container = document.getElementById('education-container');

        // Sección de Educación Formal
        const educationTitle = `
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white" data-aos="fade-up">
                <i class="fas fa-graduation-cap text-indigo-600 dark:text-indigo-400 mr-2"></i>Educación Formal
            </h2>
        `;
        container.insertAdjacentHTML('beforeend', educationTitle);

        data.education.forEach((edu, index) => {
            const educationCard = `
                <div class="card p-6 rounded-lg shadow-md dark:bg-gray-800" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${edu.degree}</h3>
                            <p class="text-indigo-700 dark:text-indigo-400 font-medium">${edu.institution}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-800 dark:text-gray-200 font-medium">${edu.period}</p>
                        </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 mb-4">${edu.field}</p>
                    <div class="mt-4">
                        <h4 class="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                            <i class="fas fa-book text-indigo-500 dark:text-indigo-400 mr-2"></i>Trabajo Final:
                        </h4>
                        <div class="pl-5">
                            <p class="text-gray-800 dark:text-gray-300">${edu.thesis.title}</p>
                            <a href="${edu.thesis.projectLink || edu.thesis.link}" 
                               class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center mt-2">
                                <i class="fas fa-external-link-alt mr-2"></i>${edu.thesis.projectLink ? 'Ver proyecto' : 'Ver en GitHub'}
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', educationCard);
        });

        // Sección de Certificaciones
        const certTitle = `
            <h2 class="text-3xl font-bold mb-6 mt-12 text-gray-900 dark:text-white" data-aos="fade-up">
                <i class="fas fa-medal text-indigo-600 dark:text-indigo-400 mr-2"></i>Certificaciones y Cursos
            </h2>
        `;
        container.insertAdjacentHTML('beforeend', certTitle);

        const certificationsList = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
                ${data.certifications.map((cert, index) => `
                    <div class="card p-6 rounded-lg shadow-md dark:bg-gray-800" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${cert.title}</h3>
                        <div class="flex items-center justify-between">
                            <p class="text-indigo-700 dark:text-indigo-400 font-medium">
                                <i class="fas fa-building mr-2"></i>${cert.institution}
                            </p>
                            <p class="text-gray-700 dark:text-gray-300">
                                <i class="fas fa-calendar-alt mr-2"></i>${cert.year}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', certificationsList);
    } catch (error) {
        console.error('Error cargando la educación:', error);
    }
}

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const data = await response.json();
        const container = document.getElementById('projects-container');

        // Usando grid con auto-rows para permitir alturas diferentes
        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto';

        data.projects.forEach((project, index) => {
            const projectCard = `
                <div class="card rounded-lg shadow-md overflow-hidden dark:bg-gray-800 h-auto" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="p-6 h-full flex flex-col">
                        <div class="flex items-start gap-4 mb-2">
                            ${project.icon ? `
                                <i class="${project.icon} text-3xl text-indigo-600 dark:text-indigo-400"></i>
                            ` : ''}
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${project.name}</h3>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">
                                    <i class="fas fa-calendar mr-2"></i>${project.startYear}${project.endYear ? ` - ${project.endYear}` : ' - Presente'}
                                </p>
                            </div>
                        </div>
                        <p class="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">${project.description}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${project.technologies.map(tech => 
                                `<span class="tech-tag px-3 py-1 text-sm rounded-full">${tech}</span>`
                            ).join('')}
                        </div>

                        <div class="flex flex-col gap-3 mb-6">
                            ${project.websiteUrl ? `
                                <a href="${project.websiteUrl}" target="_blank" 
                                   class="inline-flex items-center text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">
                                    <i class="fas fa-globe mr-2"></i> Página web / demo
                                </a>
                            ` : ''}
                            ${project.githubUrl ? `
                                <a href="${project.githubUrl}" target="_blank" 
                                   class="inline-flex items-center text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">
                                    <i class="fab fa-github mr-2"></i> Ver código en GitHub
                                </a>
                            ` : ''}
                        </div>

                        ${project.demos ? `
                            <div class="space-y-6">
                                ${project.demos.web ? `
                                    <div>
                                        <h4 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Demostración Web</h4>
                                        <div class="grid grid-cols-1 gap-4">
                                            ${project.demos.web.map(demo => `
                                                <div class="border dark:border-gray-700 rounded-lg p-4">
                                                    <h5 class="font-medium mb-2 text-gray-900 dark:text-white">${demo.title}</h5>
                                                    <video controls class="w-full rounded-lg">
                                                        <source src="${demo.videoUrl}" type="video/mp4">
                                                        Tu navegador no soporta el elemento video.
                                                    </video>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                ${project.demos.mobile ? `
                                    <div>
                                        <h4 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Demostración Móvil</h4>
                                        <div class="grid grid-cols-1 gap-4">
                                            ${project.demos.mobile.map(demo => `
                                                <div class="border dark:border-gray-700 rounded-lg p-4">
                                                    <h5 class="font-medium mb-2 text-gray-900 dark:text-white">${demo.title}</h5>
                                                    <video controls class="w-full max-w-sm mx-auto rounded-lg">
                                                        <source src="${demo.videoUrl}" type="video/mp4">
                                                        Tu navegador no soporta el elemento video.
                                                    </video>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', projectCard);
        });
    } catch (error) {
        console.error('Error cargando los proyectos:', error);
    }
}

function getGreetingByTime() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
        return '¡Buenos días!';
    } else if (hour >= 12 && hour < 20) {
        return '¡Buenas tardes!';
    } else {
        return '¡Buenas noches!';
    }
}

async function loadProfile() {
    try {
        const response = await fetch('data/profile.json');
        const data = await response.json();
        
        // Update title
        document.title = `${data.fullName} - ${data.title}`;
        
        // Update hero section content
        const heroContent = document.querySelector('.hero-section .text-white');
        heroContent.innerHTML = `
            <h1 class="text-4xl md:text-5xl font-bold mb-6">${getGreetingByTime()}</h1>
            <p class="text-xl mb-8 opacity-90">${data.description}</p>
            <div class="flex space-x-6 mb-8">
                <a href="${data.social.github}" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:scale-110">
                    <div class="w-8 h-8">
                        <img src="assets/img/brands/github.png" alt="GitHub" class="w-full h-full">
                    </div>
                </a>
                <a href="${data.social.linkedin}" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20 transition-all duration-300 transform hover:scale-110">
                    <div class="w-8 h-8">
                        <img src="assets/img/brands/linkedin.png" alt="LinkedIn" class="w-full h-full">
                    </div>
                </a>
            </div>
        `;

        // Update section cards
        const sectionLinks = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
        sectionLinks.innerHTML = data.sections.map(section => `
            <a href="${section.link}" class="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center text-white hover:bg-white/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20 transition duration-300">
                <i class="${section.icon} text-4xl mb-4"></i>
                <h2 class="text-xl font-bold mb-2">${section.title}</h2>
                <p class="opacity-75">${section.description}</p>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
}

function initializeTheme() {
    if (!document.documentElement.classList.contains('js-theme-initialized')) {
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeToggleIcon = document.getElementById('theme-toggle-icon');
        
        // Verificar si hay un tema guardado
        const savedTheme = localStorage.getItem('theme');
        
        // Aplicar el tema guardado o usar oscuro por defecto
        if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            themeToggleIcon.classList.remove('fa-sun');
            themeToggleIcon.classList.add('fa-moon');
        } else {
            document.documentElement.classList.add('dark');
            themeToggleIcon.classList.remove('fa-moon');
            themeToggleIcon.classList.add('fa-sun');
            if (!savedTheme) {
                localStorage.setItem('theme', 'dark');
            }
        }

        // Evento para cambiar el tema
        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            
            if (isDark) {
                localStorage.setItem('theme', 'dark');
                themeToggleIcon.classList.remove('fa-moon');
                themeToggleIcon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleIcon.classList.remove('fa-sun');
                themeToggleIcon.classList.add('fa-moon');
            }
        });

        document.documentElement.classList.add('js-theme-initialized');
    }
}