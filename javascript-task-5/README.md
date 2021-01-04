forked from [urfu-2017/javascript-task-5](https://github.com/urfu-2017/javascript-task-5)

# Задача «Пора на лекцию»

Перед выполнением задания внимательно прочитайте:

- [О всех этапах проверки задания](https://github.com/urfu-2017/guides/blob/master/workflow/overall.md)
- [Как отправить пулл](https://github.com/urfu-2017/guides/blob/master/workflow/pull.md)
- [Как пройти тесты](https://github.com/urfu-2017/guides/blob/master/workflow/test.md)
- Правила оформления [javascript](https://github.com/urfu-2017/guides/blob/master/codestyle/js.md), [HTML](https://github.com/urfu-2017/guides/blob/master/codestyle/html.md) и [CSS](https://github.com/urfu-2017/guides/blob/master/codestyle/css.md) кода

## Основное задание

> Мы очень хотим, чтобы код вы написали сами, а не пользовались внешними библиотеками.

От вечеринок и мальчишников возвращаемся в мрачные стены университета ­  
— время слушать лекцию и впитывать новые знания.

В файле `index.js` вас ждут студенты, готовые внимать каждому слову преподавателя:

```js
var students = {
    Sam: {
        focus: 100,
        wisdom: 50
    },
    Sally: {
        focus: 100,
        wisdom: 60
    }
};
```

И преподаватель Сергей, который вот-вот начнёт лекцию
и покажет первый слайд с бесценной информацией.

```js
lecturer
    .on('begin', students.Sam, function () {
        // Внимательно случшаем преподователя
        this.focus += 10;
    })

lecturer
    .on('slide', students.Sam, function () {
        // И впитываем мудрость с каждым слайдом
        this.wisdom += 10;
    })
```

Студента можно подписать на событие, производимое преподавателем (например, начало лекции или показ нового слайда) — то есть указать, какая функция должна быть вызвана при наступлении этого события.

Ваша задача — реализовать несколько методов:

* подписка на событие — `on`
* отписка от события — `off`
* вызов события — `emit`

Чтобы задания не казалось совсем простым,  
вам также нужно реализовать поддержку пространства имён для событий.

```js
lecturer.on('slide', students.Sam, function () {
    // И впитываем мудрость с каждым слайдом
    this.wisdom += 10;
});

lecturer.on('slide.funny', daria, function () {
    this.wisdom -= 5;
});
```

Примеры использования можно посмотреть в __index.js__ и в тестах.

**Дополнительные условия и ограничения:**

- События должны возникать в том порядке, в котором на них подписывались
- На одно событие с одинаковыми объектами и обработчиками можно подписаться неограниченное количество раз. Обработчики вызываются в порядке подписки.
- Пространства имён разделены только точкой:
    - на событие `slide.funny` произойдут события `slide.funny` и `slide` (именно в таком порядке)
    - на событие `slidee` произойдет `slidee`, но не `slide`
    - отписка от `slide.funny` отписывает только от него
    - отписка от `slide` отписывает и от `slide`, и от `slide.funny`

## Дополнительное задание (+12 к мудрости, +2 к фокусу)

> Перед выполнением внимательно прочитайте [про особенности](https://github.com/urfu-2017/guides/blob/master/workflow/extra.md)

Необходимо реализовать два дополнительных метода эмиттера. Оба метода работают аналогично `on`, но обладают некоторыми особенностями.

* `several` — подписывает на первые n событий
* `through` — подписывает на каждое n-ое событие, начиная с первого

При отрицательном или нулевом значении `through` и `several` начинают работать, как `on`!

Примеры использования этих методов можно посмотреть в __index.js__ и в тестах.

![](http://i.imgur.com/R3soz.jpg)