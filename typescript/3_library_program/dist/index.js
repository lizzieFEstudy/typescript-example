"use strict";
// Role이라는 enum을 정의 -사서, 유저
var Role;
(function (Role) {
    Role[Role["LIBRARIAN"] = 0] = "LIBRARIAN";
    Role[Role["MEMBER"] = 1] = "MEMBER";
})(Role || (Role = {}));
// 추상클래스 User
// 인자: name, age
// 추상함수 getRole을 포함
/*
abstract class User {
    instructor {
        name: this.name,
        age: this.age
    }

    abstract function getRole () {
        return Role
    }
}
*/
class User {
    // 생성자에 name과 age를 받음
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
// 추상클래스User를 상속받는 Member클래스
/*
class Member extends User {
    constructor(){
    super()
}
getRole():  return this.role =  MEMBER
}
*/
class Member extends User {
    constructor(name, age) {
        super(name, age);
    }
    getRole() {
        return Role.MEMBER;
    }
}
// 사서 클래스
// 멤버클래스랑 롤만 다름
class Librarian extends User {
    constructor(name, age) {
        super(name, age);
    }
    getRole() {
        return Role.LIBRARIAN;
    }
}
// 책 클래스
// 이름, 저자, 출판일
/*
class Book {
    constructor(public name: string, public author: string, public date: string) {
        this.name = name,
        this.author = author,
        this.date = date
    }
}
*/
class Book {
    constructor(title, author, publishedDate) {
        this.title = title;
        this.author = author;
        this.publishedDate = publishedDate;
    }
}
class Library {
    constructor() {
        this.books = [];
        // rentedBooks는 유저의 대여 이력을 관리해요!
        this.rentedBooks = new Map();
    }
    getBooks() {
        // 깊은 복사를 하여 외부에서 books를 수정하는 것을 방지합니다.
        return JSON.parse(JSON.stringify(this.books));
    }
    addBook(user, book) {
        // 권한 체크
        // 항상 사용자 권한의 체크나 인자의 유효성 검사 등을 사전 체크를 먼저 하고, 아니면 함수를 실행할 수 없게끔 먼저 가드를 세워놓은 다음, 끝나고 나면 본 로직이 실행될 수 있게끔 하는 패턴
        if (user.getRole() !== Role.LIBRARIAN) {
            console.log('사서만 도서를 추가할 수 있습니다.');
            return;
        }
        this.books.push(book);
    }
    removeBook(user, book) {
        if (user.getRole() !== Role.LIBRARIAN) {
            console.log('사서만 도서를 삭제할 수 있습니다.');
            return;
        }
        const index = this.books.indexOf(book);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }
    rentBook(user, book) {
        if (user.getRole() !== Role.MEMBER) {
            console.log('유저만 도서를 대여할 수 있습니다.');
            return;
        }
        if (this.rentedBooks.has(user.name)) {
            console.log(`${user.name}님은 이미 다른 책을 대여중이라 빌릴 수 없습니다.`);
        }
        else {
            this.rentedBooks.set(user.name, book);
            console.log(`${user.name}님이 [${book.title}] 책을 빌렸습니다.`);
        }
    }
    returnBook(user, book) {
        if (user.getRole() !== Role.MEMBER) {
            console.log('유저만 도서를 반납할 수 있습니다.');
            return;
        }
        if (this.rentedBooks.get(user.name) === book) {
            this.rentedBooks.delete(user.name);
            console.log(`${user.name}님이 [${book.title}] 책을 반납했어요!`);
        }
        else {
            console.log(`${user.name}님은 [${book.title}] 책을 빌린적이 없어요!`);
        }
    }
}
// 테스트 함수
function main() {
    const myLibrary = new Library();
    const librarian = new Librarian('르탄이', 30);
    const member1 = new Member('예비개발자', 30);
    const member2 = new Member('독서광', 28);
    const book = new Book('TypeScript 문법 종합반', '강창민', new Date());
    const book2 = new Book('금쪽이 훈육하기', '오은영', new Date());
    const book3 = new Book('요식업은 이렇게!', '백종원', new Date());
    myLibrary.addBook(librarian, book);
    myLibrary.addBook(librarian, book2);
    myLibrary.addBook(librarian, book3);
    const books = myLibrary.getBooks();
    console.log('대여할 수 있는 도서 목록:', books);
    myLibrary.rentBook(member1, book);
    myLibrary.rentBook(member2, book2);
    myLibrary.returnBook(member1, book);
    myLibrary.returnBook(member2, book2);
}
main();
