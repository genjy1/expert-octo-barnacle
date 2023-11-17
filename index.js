import {el, setChildren} from './node_modules/redom/dist/redom.es.js';

const URL = 'https://peppered-lake-thing.glitch.me/api/';

const goodDetailsPage = (id, comeBack) => {
    const body = el('div', 'Загрузка')
    fetch(`${URL}/goods/${id}`)
        .then(res => res.json())
        .then(({title, description, price})=>{
            setChildren(body, [
                el('h2', title),
                el('p', description),
                el('p', `${price}Р`),
                el('a', {href : '/', onclick(event){ event.preventDefault(); setChildren(document.body, comeBack())}, textContent: 'назад' })
            ])
        });
    return el('div', {className:'container'}, [el('h1', 'Карточка товара'), body])
}

const goodsListPage = () => {
    const list = el('ul', el('li', 'Загрузка...'));

    fetch(`${URL}goods`)
        .then(res => res.json())
        .then(data => {
            setChildren(list, data.map(({id, title}) => 
                el('li', el('a', {
                    
                    href: `/goods/${id}`,
                    onclick(event) {
                        event.preventDefault();
                        setChildren(document.body, goodDetailsPage(id, goodsListPage));
                    }
                },title))))
            })

    return el('div', {className:'container'}, [el('h1', 'Товары'),list])
}

setChildren(document.body, goodsListPage());
