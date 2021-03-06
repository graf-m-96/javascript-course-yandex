forked from [urfu-2017/javascript-task-6](https://github.com/urfu-2017/javascript-task-6)

# Задача «Свадьба Билли»

Перед выполнением задания внимательно прочитайте:

- [О всех этапах проверки задания](https://github.com/urfu-2017/guides/blob/master/workflow/overall.md)
- [Как отправить пулл](https://github.com/urfu-2017/guides/blob/master/workflow/pull.md)
- [Как пройти тесты](https://github.com/urfu-2017/guides/blob/master/workflow/test.md)
- Правила оформления [javascript](https://github.com/urfu-2017/guides/blob/master/codestyle/js.md), [HTML](https://github.com/urfu-2017/guides/blob/master/codestyle/html.md) и [CSS](https://github.com/urfu-2017/guides/blob/master/codestyle/css.md) кода

## Основное задание

> Мы очень хотим, чтобы код вы написали сами, а не пользовались внешними библиотеками.

Картофельная вечеринка прошла очень удачно для Билли, он познакомился с девушкой, и спустя какое-то время его корабль, под названием «Любовь», наконец-то готов отправиться в бухту, под названием «Семья». Настало время организовать свадьбу для него.

Билли вновь достаёт свой бумажной блокнотик с записями о друзьях. Кстати, он немного обновил его после картофельной вечеринки – добавил информацию о том, кто и с кем дружит (friends), и кто является его лучшими друзьями (best):
```js
var friends = [
    {
        name: 'Sam',
        friends: ['Mat', 'Sharon'],
        gender: 'male',
        best: true
    },
    {
        name: 'Sally',
        friends: ['Brad', 'Emily'],
        gender: 'female',
        best: true
    }
];
```

Билли хочет, чтобы обязательно был соблюдён ряд условий:
- Во-первых, на свадьбе должны быть не только друзья, но и друзья друзей
- Во-вторых, слишком незнакомые парни смущают Билли и он планирует ограничить уровень неизвестности определённым кругом
- В-третьих, чтобы никому не было грустно – он их собирает в пары «парень + девушка»

Для того, чтобы это реализовать понадобятся фильтры и итераторы:
```js
// Создаем фильтры парней и девушек
var maleFilter = new lib.MaleFilter();
var femaleFilter = new lib.FemaleFilter();

// Создаем итераторы
var femaleIterator = new lib.Iterator(friends, femaleFilter);

// Среди парней приглашаем только луших друзей и друзей лучших друзей
var maleIterator = new lib.LimitedIterator(friends, maleFilter, 2);

var invitedFriends = [];

// Собираем пары «парень + девушка»
while (!maleIterator.done() && !femaleIterator.done()) {
    invitedFriends.push([
        maleIterator.next(),
        femaleIterator.next()
    ]);
}

// Если остались девушки, то приглашаем остальных
while (!femaleIterator.done()) {
    invitedFriends.push(femaleIterator.next());
}
```

Примеры использования можно посмотреть в __index.js__ и в тестах.

### Общие условия
- Лучшие друзья помечены флагом `best`
- Для каждого друга указан список его друзей
- Дружба всегда взаимная
- Обход должен происходить, начиная с **лучших** друзей
- Обход всегда идет **в алфавитном порядке** имен
- Друзья не должны обходиться дважды
- Первый круг друзей – это лучшие друзья
- Второй круг друзей – это друзья лучших друзей
- Третий круг и остальные строятся аналогичным образом
- Гарантируется, что на входе будут корректные условия
    - Неориентированный граф друзей
    - Все перечисленные друзья в свойствах `friends` будут существовать во входном массиве
- Граф друзей может быть несвязным и/или цикличным

### Условия для Iterator
- Создает объект итератора, с помощью которого можно обойти друзей по заданным правилам
- На вход он принимает массив и объект фильтра для фильтрации некоторых друзей
- Если объект фильтра не является инстансом функции-конструктора `Filter`, должна выброситься ошибка `TypeError`
- Итератор должен иметь два метода: `done()` и `next()`
- Метод `done()` возвращает `true`, если обход закончен, и `false` в противном случае
- Метод `next()` возвращает объект друга и `null`, если обход закончен

### Условия для LimitedIterator
- Наследник `Iterator`
- Имеет ограничение по кругу (`maxLevel`).
  Если передан 1, то такой итератор обойдет только первый круг друзей.
  Если передано 2, то обойдет первый и второй. И так далее.

### Условия для Filter
- Создает фильтр, который решает какой друг подходит для итерации
- По умолчанию такой фильтр никого не отсеивает

### Условия для MaleFilter
- Наследник `Filter`
- Позволяет итерироваться по друзьям мужского пола

### Условия для FemaleFilter
- Наследник `Filter`
- Позволяет итерироваться по друзьям женского пола

Примеры использования можно посмотреть в __index.js__ и в тестах.

<img width="800" alt="wedding" src="https://cloud.githubusercontent.com/assets/4534405/20384988/82083cf4-acd7-11e6-893f-46dd4d7c5004.png">
