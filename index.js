import {el, setChildren} from 'redom';
import axios from 'axios';
import Navigo from 'navigo';

const URL = 'https://peppered-lake-thing.glitch.me/api';
const router = new Navigo('/');

const goodDetailsPage = (id) => {
    const body = el('div', 'Загрузка')
    axios.get(`${URL}/goods/${id}`)
        .then(({data: {title, description, price}})=>{
            setChildren(body, [
                el('h2', title),
                el('p', description),
                el('p', `${price}Р`),
                el('a', {href : '/', onclick(event){ event.preventDefault();
                    router.navigate(event.target.getAttribute('href'));
                    setChildren(document.body, goodsListPage())}, textContent: 'Вернуться назад' })
            ])
        });
    return el('div', {className:'container'}, [el('h1', 'Карточка товара'), body])
}

const goodsListPage = () => {
    const list = el('ul', el('li', 'Загрузка...'));

    axios.get(`${URL}/goods`)
        .then(({data}) => {
            // console.log(res);
            setChildren(list, data.map(({id, title}) => 
                el('li', el('a', {
                    
                    href: `/goods/${id}`,
                    onclick(event) {
                        event.preventDefault();
                        router.navigate(event.target.getAttribute('href'))
                        setChildren(document.body, goodDetailsPage(id, goodsListPage));
                    }
                },title))))
            })

    return el('div', {className:'container'}, [el('h1', 'Товары'),list])
}

router.on('/', () => {
    setChildren(document.body, goodsListPage());
});
router.on('goods/:id', ({data: {id}}) => {
    setChildren(document.body, goodDetailsPage(id))
});

// setChildren(document.body, goodsListPage());

router.resolve()