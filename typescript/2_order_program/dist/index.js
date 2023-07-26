"use strict";
// 1. 기능들을 수행하기에 앞서 필요한 인터페이스 & 데이터(자료구조) 정의하기!
// 데이터 정의
/*
function createOrder(orderId: number, user: User, beverage: Beverage ): Order {
    return {
        orderId,
  customerId: user.id,
  customerName: user.name,
  beverageName: beverage.name,
  status: 'placed',
    }

  type updateOrder = Pick<Order, "status">;
  const doneOrder: updateOrder = {status: 'completed'}
*/
// 카페에서 어떤 음료를 시킬 수 있는지에 대한 음료 목록 관리
let beverages = [];
// 주문 관리
let orders = [];
// 2. 기능들을 실제로 수행할 함수 구현하기
// 어떠한 기능이건 유저가 어드민인지 체크, 고객인지 체크하는 함수가 필요
/*
function chkAdmin(user: User) {
    if (user.role === 'admin' ) return true;
    return false;
}
function chkCustomer(user: User) {
    if (user.role === 'customer' ) return true;
    return false;
}
*/
function isAdmin(user) {
    return user.role === 'admin';
}
function isCustomer(user) {
    return user.role === 'customer';
}
// 음료 목록에 음료를 새롭게 등록하는 함수
// 이 함수는 어드민만 호출할 수 있어야 함!
function addBeverage(user, name, price) {
    if (!isAdmin(user)) {
        console.log('권한이 없습니다.');
        return;
    }
    const newBeverage = { name, price };
    beverages.push(newBeverage);
}
// 음료 목록에서 음료를 삭제
function removeBeverage(user, beverageName) {
    if (!isAdmin(user)) {
        console.log('권한이 없습니다.');
        return;
    }
    beverages = beverages.filter((beverage) => beverage.name !== beverageName);
}
// 음료 목록 조회 기능 -어드민, 고객
function getBeverages(user) {
    if (!user) {
        return [];
    }
    return beverages;
}
// 음료 찾기 함수
// Beverage | undefined 음료를 찾거나, 찾지 못하거나. 데이터 타입이 두 개 중에 하나가 되는거
function findBeverage(beverageName) {
    // 음료가 있으면 음료를 리턴. 없으면 undefined를 리턴
    return beverages.find((beverage) => beverage.name === beverageName);
}
// 음료 주문 기능
// 시그니처: 고객만 호출할 수 있어야 함. 엉뚱한 커피 주문은 막아야 함
// 주문 Id를 리턴
/*
function placeOrder(user: User, beverageName: string): number {
    if (!isCustomer(user)) {
        console.log('권한이 없습니다.');
        return -1;
      }
      if (!findBeverage(beverageName)) {
        console.log('없는 메뉴입니다.');
        return -1;
      }

    return orders[orders.length - 1].orderId + 1;
}
*/
function placeOrder(user, beverageName) {
    // 손님만
    if (!isCustomer(user)) {
        console.log('권한이 없습니다.');
        return -1;
    }
    // 파는 음료만
    const beverage = findBeverage(beverageName);
    if (!beverage) {
        console.log('해당 음료를 찾을 수 없습니다.');
        return -1;
    }
    // 위 조건을 통과하면 새로운 order 생성
    const newOrder = {
        orderId: orders.length + 1,
        customerId: user.id,
        customerName: user.name,
        beverageName,
        status: 'placed',
    };
    orders.push(newOrder);
    // 주문 Id 리턴
    return newOrder.orderId;
}
// 음료 준비 완료 기능
// 커피를 제조하는 admin이 커피가 완료됐다고 체크할거기때문에 admin만 부를 수 있어야 함
/*
function completeOrder(user: User, orderId: number): void {
    if (!isAdmin(user)) {
        console.log('권한이 없습니다.');
        return;
      }

      const updateOrders = orders.filter((order) => {
        if(order.orderId == orderId) {
            order.status = 'completed';
        }
        return true;
      })
      orders = updateOrders
}
*/
function completeOrder(user, orderId) {
    if (!isAdmin(user)) {
        console.log('권한이 없습니다.');
        return;
    }
    // 주문을 찾아 -???????????????????????????
    // 찾아서 수정한걸 적용을 안한거같은데????????? 어케 써먹음???
    const order = orders.find((order) => order.orderId === orderId);
    if (order) {
        order.status = 'completed'; // 단순히 주문의 상태만 바꾸고 끝!
        console.log(`[고객 메시지] ${order.customerName}님~ 주문하신 ${order.beverageName} 1잔 나왔습니다~`);
    }
}
function pickUpOrder(user, orderId) {
    if (!isCustomer(user)) {
        console.log('권한이 없습니다.');
        return;
    }
    const order = orders.find(
    // 주문아이디와 고객아이디 일치여부 체크해서 인터셉터 방지
    (order) => order.orderId === orderId && order.customerId === user.id);
    if (order && order.status === 'completed') {
        order.status = 'picked-up';
        console.log(`[어드민 메시지] 고객 ID[${order.customerId}]님이 주문 ID[${orderId}]을 수령했습니다.`);
    }
}
// -----------------------------
// 아래부터는 테스트 함수들~
function main() {
    const admin = {
        id: 1,
        name: '바리스타',
        role: 'admin',
    };
    // 유저 생성
    const member1 = {
        id: 2,
        name: '르탄이',
        role: 'customer',
    };
    const member2 = {
        id: 3,
        name: '꿈꾸는개발자',
        role: 'customer',
    };
    // 음료 등록
    addBeverage(admin, '아메리카노', 4000);
    addBeverage(admin, '카페라떼', 4500);
    addBeverage(admin, '에스프레소', 3000);
    // 음료 삭제
    removeBeverage(admin, '에스프레소');
    console.log(`안녕하세요~ ${member1.name} 고객님! 별다방에 오신 것을 환영합니다. 저희는 ${JSON.stringify(getBeverages(member1))}를 판매하고 있습니다.`);
    // 음료 주문
    const orderId1 = placeOrder(member1, '아메리카노');
    if (orderId1 > 0) {
        setTimeout(() => {
            // 음료 제작 완료
            completeOrder(admin, orderId1);
            // 음료 수령
            pickUpOrder(member1, orderId1);
        }, 1000);
    }
    console.log(`안녕하세요~ ${member2.name} 고객님! 별다방에 오신 것을 환영합니다. 저희는 ${JSON.stringify(getBeverages(member2))}를 판매하고 있습니다.`);
    // 음료 주문
    const orderId2 = placeOrder(member2, '카페라떼');
    if (orderId2 > 0) {
        setTimeout(() => {
            // 음료 제작 완료
            completeOrder(admin, orderId2);
            // 음료 수령
            pickUpOrder(member2, orderId2);
        }, 3000);
    }
}
main();
