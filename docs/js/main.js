let currentTranslations = {};

async function loadTranslations(lang) {
    try {
        // Ahora solo necesitamos cargar el archivo del idioma correspondiente que contiene las traducciones de la interfaz
        const response = await fetch(`data/i18n/${lang}.json`);
        currentTranslations = await response.json();
        return currentTranslations;
    } catch (error) {
        console.error('Error loading translations:', error);
        return null;
    }
}

function translate(key) {
    const keys = key.split('.');
    let value = currentTranslations;
    
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }
    }
    
    return value;
}

function initializeLanguage() {
    const languageToggleBtn = document.getElementById('language-toggle');
    const languageToggleMobile = document.getElementById('language-toggle-mobile');
    
    // Obtener el idioma guardado o usar español por defecto
    const savedLanguage = localStorage.getItem('language') || 'es';
    
    // Cargar las traducciones y actualizar la interfaz
    loadTranslations(savedLanguage).then(() => {
        updatePageContent();
        updateLanguageButton(savedLanguage);
    });

    // Evento para cambiar el idioma
    languageToggleBtn.addEventListener('click', async () => {
        const currentLang = localStorage.getItem('language') || 'es';
        const newLang = currentLang === 'es' ? 'en' : 'es';
        
        await loadTranslations(newLang);
        localStorage.setItem('language', newLang);
        updatePageContent();
        updateLanguageButton(newLang);
    });

    // Sincronizar el cambio de idioma en el menú móvil
    languageToggleMobile.addEventListener('click', () => {
        languageToggleBtn.click();
    });
}

function updateLanguageButton(lang) {
    const languageToggleBtn = document.getElementById('language-toggle');
    const languageToggleMobile = document.getElementById('language-toggle-mobile');
    
    // Actualizar botones
    languageToggleBtn.textContent = lang === 'es' ? 'EN' : 'ES';
    languageToggleMobile.querySelector('span').textContent = lang === 'es' ? 'Change to English' : 'Cambiar a Español';
    
    // Actualizar el atributo lang del HTML
    document.documentElement.lang = lang;
}

function updatePageContent() {
    // Actualizar elementos de navegación
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translate(key);
    });
    
    // Recargar el contenido dinámico de la página actual
    const pathname = window.location.pathname;
    if (pathname.includes('portfolio.html')) {
        loadProjects();
    } else if (pathname.includes('education.html')) {
        loadEducation();
    } else if (pathname.includes('experience.html')) {
        loadExperience();
    } else if (pathname.endsWith('index.html') || pathname.endsWith('/')) {
        loadProfile();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar el tema primero para evitar parpadeos
    initializeTheme();
    
    // Inicializar el idioma
    initializeLanguage();
    
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
        const currentLang = localStorage.getItem('language') || 'es';
        const suffix = currentLang === 'en' ? '_en' : '';
        const response = await fetch('data/experience.json');
        const data = await response.json();
        const container = document.getElementById('experience-container');
        container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevo contenido

        data.experiences.forEach((exp, index) => {
            const experienceCard = `
                <div class="card p-6 rounded-lg shadow-md dark:bg-gray-800" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${exp['position' + suffix]}</h3>
                            <p class="text-indigo-700 dark:text-indigo-400 font-medium">${exp['company' + suffix]}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-800 dark:text-gray-200 font-medium">${exp['period' + suffix]}</p>
                            <p class="text-gray-700 dark:text-gray-300"><i class="fas fa-map-marker-alt mr-1"></i>${exp['location' + suffix]}</p>
                        </div>
                    </div>
                    <p class="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">${exp['description' + suffix]}</p>
                    <div class="mb-4">
                        <h4 class="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                            <i class="fas fa-tasks text-indigo-500 dark:text-indigo-400 mr-2"></i>${translate('sections.mainFunctions')}
                        </h4>
                        <ul class="list-disc pl-5 text-gray-800 dark:text-gray-300 space-y-1">
                            ${exp['funciones' + suffix].map(funcion => `
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
        const currentLang = localStorage.getItem('language') || 'es';
        const suffix = currentLang === 'en' ? '_en' : '';
        const response = await fetch('data/education.json');
        const data = await response.json();
        const container = document.getElementById('education-container');
        container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevo contenido

        // Sección de Educación Formal
        const educationTitle = `
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white" data-aos="fade-up">
                <i class="fas fa-graduation-cap text-indigo-600 dark:text-indigo-400 mr-2"></i>${translate('sections.formalEducation')}
            </h2>
        `;
        container.insertAdjacentHTML('beforeend', educationTitle);

        data.education.forEach((edu, index) => {
            const educationCard = `
                <div class="card p-6 rounded-lg shadow-md dark:bg-gray-800" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${edu['degree' + suffix]}</h3>
                            <p class="text-indigo-700 dark:text-indigo-400 font-medium">${edu['institution' + suffix]}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-gray-800 dark:text-gray-200 font-medium">${edu['period' + suffix]}</p>
                        </div>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 mb-4">${edu['field' + suffix]}</p>
                    <div class="mt-4">
                        <h4 class="font-semibold mb-2 text-gray-900 dark:text-white flex items-center">
                            <i class="fas fa-book text-indigo-500 dark:text-indigo-400 mr-2"></i>${translate('sections.finalProject')}
                        </h4>
                        <div class="pl-5">
                            <p class="text-gray-800 dark:text-gray-300">${edu.thesis['title' + suffix]}</p>
                            <a href="${edu.thesis.projectLink || edu.thesis.link}" 
                               class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center mt-2">
                                <i class="fas fa-external-link-alt mr-2"></i>${translate(edu.thesis.projectLink ? 'sections.viewProject' : 'sections.viewGithub')}
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
                <i class="fas fa-medal text-indigo-600 dark:text-indigo-400 mr-2"></i>${translate('sections.certifications')}
            </h2>
        `;
        container.insertAdjacentHTML('beforeend', certTitle);

        const certificationsList = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
                ${data.certifications.map((cert, index) => `
                    <div class="card p-6 rounded-lg shadow-md dark:bg-gray-800" data-aos="fade-up" data-aos-delay="${index * 100}">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${cert['title' + suffix]}</h3>
                        <div class="flex items-center justify-between">
                            <p class="text-indigo-700 dark:text-indigo-400 font-medium">
                                <i class="fas fa-building mr-2"></i>${cert['institution' + suffix]}
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
        const currentLang = localStorage.getItem('language') || 'es';
        const suffix = currentLang === 'en' ? '_en' : '';
        const response = await fetch('data/projects.json');
        const data = await response.json();
        const container = document.getElementById('projects-container');
        container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevo contenido

        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto';

        data.projects.forEach((project, index) => {
            const targetUrl = project.websiteUrl || project.githubUrl || '#';
            const projectImage = project.image || 'assets/img/projects/Gemini_Generated_Image_project_placeholder.jpg';
            const projectCard = `
                <div class="card rounded-lg shadow-md overflow-hidden dark:bg-gray-800 h-auto" data-aos="fade-up" data-aos-delay="${index * 100}" onclick="window.open('${targetUrl}', '_blank')">
                    <img src="${projectImage}" alt="${project['name' + suffix]}" class="w-full h-48 object-cover">
                    <div class="p-6 h-full flex flex-col">
                        <div class="flex items-start gap-4 mb-2">
                            ${project.icon ? `
                                <i class="${project.icon} text-3xl text-indigo-600 dark:text-indigo-400"></i>
                            ` : ''}
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">${project['name' + suffix]}</h3>
                                <p class="text-gray-600 dark:text-gray-400 text-sm">
                                    <i class="fas fa-calendar mr-2"></i>${project.startYear}${project.endYear ? ` - ${project.endYear}` : ' - ' + (currentLang === 'es' ? 'Presente' : 'Present')}
                                </p>
                            </div>
                        </div>
                        <p class="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">${project['description' + suffix]}</p>
                        
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${project.technologies.map(tech => 
                                `<span class="tech-tag px-3 py-1 text-sm rounded-full">${tech}</span>`
                            ).join('')}
                        </div>

                        <div class="flex flex-col gap-3 mb-6">
                            ${project.websiteUrl ? `
                                <a href="${project.websiteUrl}" target="_blank" 
                                   class="inline-flex items-center text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">
                                    <i class="fas fa-globe mr-2"></i> ${translate('sections.websiteDemo')}
                                </a>
                            ` : ''}
                            ${project.githubUrl ? `
                                <a href="${project.githubUrl}" target="_blank" 
                                   class="inline-flex items-center text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium">
                                    <i class="fab fa-github mr-2"></i> ${translate('sections.viewGithub')}
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', projectCard);
        });
    } catch (error) {
        console.error('Error cargando los proyectos:', error);
    }
}

async function loadProfile() {
    try {
        const currentLang = localStorage.getItem('language') || 'es';
        const response = await fetch('data/profile.json');
        const data = await response.json();
        
        // Actualizar título
        const suffix = currentLang === 'en' ? '_en' : '';
        document.title = `${data.fullName} - ${data['title' + suffix]}`;
        
        // Actualizar contenido de la sección hero
        const heroContent = document.querySelector('.hero-section .text-white');
        const greeting = translate('greetings.' + getTimeOfDay());
        heroContent.innerHTML = `
            <h1 class="text-4xl md:text-5xl font-bold mb-6">${greeting}</h1>
            <p class="text-xl mb-8 opacity-90">${translate('profile.intro')}</p>
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

        // Actualizar tarjetas de sección
        const sectionLinks = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
        sectionLinks.innerHTML = data.sections.map(section => `
            <a href="${section.link}" class="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center text-white hover:bg-white/20 dark:bg-gray-800/10 dark:hover:bg-gray-800/20 transition duration-300">
                <i class="${section.icon} text-4xl mb-4"></i>
                <h2 class="text-xl font-bold mb-2">${section['title' + suffix]}</h2>
                <p class="opacity-75">${section['description' + suffix]}</p>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    const currentLang = localStorage.getItem('language') || 'es';
    
    if (hour >= 6 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 20) {
        return 'afternoon';
    } else if (hour >= 20 && hour < 22) {
        return 'evening';
    } else {
        // Entre las 22h y las 6h
        return 'night';
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