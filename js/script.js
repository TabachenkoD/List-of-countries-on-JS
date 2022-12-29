function initCountryInTheWorld() {
    const form = document.querySelector('form');
    const content = document.querySelector('.content');

    if (!form) {
        return;
    };

    const input = form.querySelector('input');
    const select = form.querySelector('select');

    function contentTemplate(varJson, iterattor) {
        const strTemplate = varJson[iterattor].capital ? varJson[iterattor].capital[0] : varJson[iterattor].name.common;
        const countryCardTemplate = ` 
            <div class="countryCard">
                <img src="${varJson[iterattor].flags.svg}" alt="img">
                <ul>
                    <li class="nameCountry">${varJson[iterattor].name.common}</li>
                    <li><b>Population:</b> ${varJson[iterattor].population.toLocaleString()}</li>
                    <li><b>Region:</b> ${varJson[iterattor].region}</li>
                    <li><b>Capital:</b> ${strTemplate}</li>
                </ul>
            </div> 
            `;
        return countryCardTemplate;
    }

    const sortByName = (arr) => {
        arr.sort((a, b) => a.name.common.toLowerCase().trim() > b.name.common.toLowerCase().trim() ? 1 : -1)
    };

    async function getCountryByRegion(selectVal) {
        try {
            if (selectVal === 'Filter by Region') {
                await getAllCountry();
            } else {
                const response = await fetch(`https://restcountries.com/v3.1/region/${selectVal}`);
                const respResult = await response.json();

                sortByName(respResult);

                content.innerHTML = "";
                for (let i = 0; i < respResult.length; i++) {
                    content.innerHTML += contentTemplate(respResult, i);
                }

                checkImg();
            }
        } catch (Error) {
            console.log(Error.toString());
        }
    };

    async function getAllCountry() {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/all`);
            const respResult = await response.json();
            sortByName(respResult);

            content.innerHTML = "";
            for (let i = 0; i < respResult.length; i++) {
                content.innerHTML += contentTemplate(respResult, i);
            }

            checkImg();
        } catch (Error) {
            console.log(Error.toString());
        }
    };

    function checkImg() {
        const img = content.querySelectorAll('img');

        img.forEach(function (elem) {
            elem.onerror = () => {
                elem.src = '/img/noImage.png';
            }
        });
    }
    const addPreloader = () => {
        const templ = `
            <div class="preloader">
                <div class="loader"></div>
            </div>
            `;

        content.innerHTML = templ;
    };

    document.addEventListener('DOMContentLoaded', () => {
        addPreloader();
        getAllCountry();
    });

    form.addEventListener('submit', (e) => e.preventDefault())

    input.addEventListener('input', () => {
        const countryCard = document.querySelectorAll('.nameCountry');
        const inpVal = input.value.toLowerCase().trim();
        const regExp = /[^a-z]/gi;

        if (inpVal != '' && !regExp.test(inpVal)) {
            countryCard.forEach((elem) => {
                if (elem.innerText.toLowerCase().search(inpVal) == -1) {
                    elem.closest('div').classList.add('hide')
                } else {
                    elem.closest('div').classList.remove('hide')
                }
            })
        } else {
            countryCard.forEach((elem) => {
                elem.closest('div').classList.remove('hide')
            })
        }

    });

    if (select) {
        select.addEventListener('change', () => {
            addPreloader();
            getCountryByRegion(select.value)
        });
    }
}

initCountryInTheWorld();

function colorTheme() {
    const body = document.body;
    const btn = body.querySelector('button');
    const preferenceQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const addDarkMode = () => {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        btn.innerHTML = 'Light mode'
    };

    const addLightMode = () => {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
        btn.innerHTML = 'Dark mode'
    };

    const toggleTheme = () => !body.classList.contains("dark-mode") ? addDarkMode() : addLightMode();
    const checkPreference = () => preferenceQuery.matches ? addDarkMode() : addLightMode();

    if (btn) {
        btn.addEventListener("click", toggleTheme);
    } else {
        alert('Button to chenge color theme NOT Found!')
    }

    window.addEventListener("DOMContentLoaded", checkPreference);
}

colorTheme();