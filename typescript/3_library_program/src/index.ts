// Role이라는 enum을 정의 -사서, 유저
enum Role {
  LIBRARIAN, // 사서
  MEMBER, // 멤버
}

// 추상클래스 User
// 인자: name, age
// 추상함수 getRole을 포함
abstract class User {
  // 생성자에 name과 age를 받음
  constructor(public name: string, public age: number) {}

  // Role을 반환하는 추상함수.
  // User를 상속받는 클래스들은 이 getRole() 부분을 꼭 구현해야 됨
  abstract getRole(): Role;
}

// 추상클래스User를 상속받는 Member클래스
class Member extends User {
  constructor(name: string, age: number) {
    super(name, age);
  }
  getRole(): Role {
    return Role.MEMBER;
  }
}

// 사서 클래스
// 멤버클래스랑 롤만 다름
class Librarian extends User {
  constructor(name: string, age: number) {
    super(name, age);
  }
  getRole(): Role {
    return Role.LIBRARIAN;
  }
}

// 책 클래스
// 이름, 저자, 출판일
class Book {
  constructor(public title: string, public author: string, public publishedDate: Date) {}
}

// 도서관이 꼭 갖추어야 할 기능을 정의한 명령어
// 기능 명세.
// 타입스크립트는 인터페이스에 데이터도 포함되지만
// 전통적인 인터페이스는 이렇게 메소드만 규격처럼 나와있음
interface RentManager {
  getBooks(): Book[]; // 도서관의 현재 도서 목록을 확인하는 함수
  addBook(user: User, book: Book): void; // 사서가 도서관에 새로운 도서롤 입고할 때 호출하는 함수
  removeBook(user: User, book: Book): void; // 사서가 도서관에서 도서를 폐기할 때 호출하는 함수
  rentBook(user: Member, book: Book): void; // 사용자가 책을 빌릴 때 호출하는 함수
  returnBook(user: Member, book: Book): void; // 사용자가 책을 반납할 때 호출하는 함수
}

class Library implements RentManager {
  private books: Book[] = [];
  // rentedBooks는 유저의 대여 이력을 관리해요!
  private rentedBooks: Map<string, Book> = new Map<string, Book>();

  getBooks(): Book[] {
    // 깊은 복사를 하여 외부에서 books를 수정하는 것을 방지합니다.
    return JSON.parse(JSON.stringify(this.books));
  }

  addBook(user: User, book: Book): void {
    // 권한 체크
    // 항상 사용자 권한의 체크나 인자의 유효성 검사 등을 사전 체크를 먼저 하고, 아니면 함수를 실행할 수 없게끔 먼저 가드를 세워놓은 다음, 끝나고 나면 본 로직이 실행될 수 있게끔 하는 패턴
    if (user.getRole() !== Role.LIBRARIAN) {
      console.log('사서만 도서를 추가할 수 있습니다.');
      return;
    }

    this.books.push(book);
  }

  removeBook(user: User, book: Book): void {
    if (user.getRole() !== Role.LIBRARIAN) {
      console.log('사서만 도서를 삭제할 수 있습니다.');
      return;
    }

    const index = this.books.indexOf(book);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
  }

  rentBook(user: User, book: Book): void {
    if (user.getRole() !== Role.MEMBER) {
      console.log('유저만 도서를 대여할 수 있습니다.');
      return;
    }

    if (this.rentedBooks.has(user.name)) {
      console.log(`${user.name}님은 이미 다른 책을 대여중이라 빌릴 수 없습니다.`);
    } else {
      this.rentedBooks.set(user.name, book);
      console.log(`${user.name}님이 [${book.title}] 책을 빌렸습니다.`);
    }
  }

  returnBook(user: User, book: Book): void {
    if (user.getRole() !== Role.MEMBER) {
      console.log('유저만 도서를 반납할 수 있습니다.');
      return;
    }

    if (this.rentedBooks.get(user.name) === book) {
      this.rentedBooks.delete(user.name);
      console.log(`${user.name}님이 [${book.title}] 책을 반납했어요!`);
    } else {
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
