// Student는 type이라고 생각하면 됨
// Student라는 type의 객체를 받아서 평균을 계산하는 calculateAverage라는 함수를 만들거
interface Student {
  name: string;
  age: number;
  scores: {
    korean: number;
    math: number;
    society: number;
    science: number;
    english: number;
  };
}

// 평균점수를 매개 변수로 받고
// 학점을 문자열로 return 해주는 함수
function assignGrade(average: number): string {
  if (average >= 90) {
    return 'A';
  } else if (average >= 80) {
    return 'B';
  } else if (average >= 70) {
    return 'C';
  } else if (average >= 60) {
    return 'D';
  } else {
    return 'F';
  }
}

// function calculateAverage(student: Student) : number {
//     const scoresArr = Object.values(student.scores);
//     return scoresArr.reduce((calc, curr) => calc += curr) / scoresArr.length
// }

function calculateAverage(student: Student): number {
  const sum = student.scores.korean + student.scores.math + student.scores.society + student.scores.science + student.scores.english;
  const average = sum / 5;
  return average;
}

// 아래 인자들이 주어지면 student라는 객체로 변환해주는 함수
function createStudent(name: string, age: number, korean: number, math: number, society: number, science: number, english: number): Student {
  return {
    name, // name : name의 축약표현
    age, // age : age
    scores: {
      korean,
      math,
      society,
      science,
      english,
    },
  };
}

function printResult(student: Student): void {
  const average = calculateAverage(student); // 평균을 계산
  const grade = assignGrade(average); // 계산된 평균을 기준으로 학점을 추출
  console.log(`${student.name} (${student.age}세) - 평균: ${average.toFixed(2)}, 학점: ${grade}`);
}

function main(): void {
  const spartan = createStudent('Spartan', 30, 95, 89, 76, 90, 97);
  printResult(spartan);
}

main();
