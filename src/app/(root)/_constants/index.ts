import { Monaco } from '@monaco-editor/react'
import { Theme } from '../../../types'

type LanguageConfig = Record<
  string,
  {
    id: string
    label: string
    logoPath: string
    pistonRuntime: { language: string; version: string }
    monacoLanguage: string
    defaultCode: string
  }
>

export const LANGUAGE_CONFIG: LanguageConfig = {
  javascript: {
    id: 'javascript',
    label: '자바스크립트',
    logoPath: '/javascript.png',
    pistonRuntime: { language: 'javascript', version: '18.15.0' }, // 사용할 API
    monacoLanguage: 'javascript',
    defaultCode: `// 자바스크립트 플레이그라운드
const numbers = [1, 2, 3, 4, 5];

// 숫자를 제곱으로 매핑
const squares = numbers.map(n => n * n);
console.log('원래 숫자:', numbers);
console.log('제곱된 숫자:', squares);

// 짝수 필터링
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('짝수:', evenNumbers);

// reduce를 사용하여 합계 계산
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log('숫자의 합계:', sum);`,
  },
  typescript: {
    id: 'typescript',
    label: '타입스크립트',
    logoPath: '/typescript.png',
    pistonRuntime: { language: 'typescript', version: '5.0.3' },
    monacoLanguage: 'typescript',
    defaultCode: `// 타입스크립트 플레이그라운드
interface NumberArray {
  numbers: number[];
  sum(): number;
  squares(): number[];
  evenNumbers(): number[];
}

class MathOperations implements NumberArray {
  constructor(public numbers: number[]) {}

  sum(): number {
    return this.numbers.reduce((acc, curr) => acc + curr, 0);
  }

  squares(): number[] {
    return this.numbers.map(n => n * n);
  }

  evenNumbers(): number[] {
    return this.numbers.filter(n => n % 2 === 0);
  }
}

const math = new MathOperations([1, 2, 3, 4, 5]);

console.log('원래 숫자:', math.numbers);
console.log('제곱된 숫자:', math.squares());
console.log('짝수:', math.evenNumbers());
console.log('숫자의 합계:', math.sum());`,
  },
  python: {
    id: 'python',
    label: '파이썬',
    logoPath: '/python.png',
    pistonRuntime: { language: 'python', version: '3.10.0' },
    monacoLanguage: 'python',
    defaultCode: `# 파이썬 플레이그라운드
numbers = [1, 2, 3, 4, 5]

# 숫자를 제곱으로 매핑
squares = [n ** 2 for n in numbers]
print(f"원래 숫자: {numbers}")
print(f"제곱된 숫자: {squares}")

# 짝수 필터링
even_numbers = [n for n in numbers if n % 2 == 0]
print(f"짝수: {even_numbers}")

# 합계 계산
numbers_sum = sum(numbers)
print(f"숫자의 합계: {numbers_sum}")`,
  },
  java: {
    id: 'java',
    label: '자바',
    logoPath: '/java.png',
    pistonRuntime: { language: 'java', version: '15.0.2' },
    monacoLanguage: 'java',
    defaultCode: `public class Main {
  public static void main(String[] args) {
      // 배열 생성
      int[] numbers = {1, 2, 3, 4, 5};
      
      // 원래 숫자 출력
      System.out.print("원래 숫자: ");
      printArray(numbers);
      
      // 제곱 계산 및 출력
      int[] squares = new int[numbers.length];
      for (int i = 0; i < numbers.length; i++) {
          squares[i] = numbers[i] * numbers[i];
      }
      System.out.print("제곱된 숫자: ");
      printArray(squares);
      
      // 짝수 출력
      System.out.print("짝수: ");
      for (int n : numbers) {
          if (n % 2 == 0) System.out.print(n + " ");
      }
      System.out.println();
      
      // 합계 계산 및 출력
      int sum = 0;
      for (int n : numbers) sum += n;
      System.out.println("숫자의 합계: " + sum);
  }
  
  private static void printArray(int[] arr) {
      for (int n : arr) System.out.print(n + " ");
      System.out.println();
  }
}`,
  },
  go: {
    id: 'go',
    label: '고',
    logoPath: '/go.png',
    pistonRuntime: { language: 'go', version: '1.16.2' },
    monacoLanguage: 'go',
    defaultCode: `package main

import "fmt"

func main() {
  // 슬라이스 생성
  numbers := []int{1, 2, 3, 4, 5}
  
  // 원래 숫자 출력
  fmt.Println("원래 숫자:", numbers)
  
  // 제곱 계산
  squares := make([]int, len(numbers))
  for i, n := range numbers {
      squares[i] = n * n
  }
  fmt.Println("제곱된 숫자:", squares)
  
  // 짝수 필터링
  var evenNumbers []int
  for _, n := range numbers {
      if n%2 == 0 {
          evenNumbers = append(evenNumbers, n)
      }
  }
  fmt.Println("짝수:", evenNumbers)
  
  // 합계 계산
  sum := 0
  for _, n := range numbers {
      sum += n
  }
  fmt.Println("숫자의 합계:", sum)
}`,
  },
  rust: {
    id: 'rust',
    label: '러스트',
    logoPath: '/rust.png',
    pistonRuntime: { language: 'rust', version: '1.68.2' },
    monacoLanguage: 'rust',
    defaultCode: `fn main() {
    // 벡터 생성
    let numbers = vec![1, 2, 3, 4, 5];
    
    // 원래 숫자 출력
    println!("원래 숫자: {:?}", numbers);
    
    // 제곱 계산
    let squares: Vec<i32> = numbers
        .iter()
        .map(|&n| n * n)
        .collect();
    println!("제곱된 숫자: {:?}", squares);
    
    // 짝수 필터링
    let even_numbers: Vec<i32> = numbers
        .iter()
        .filter(|&&n| n % 2 == 0)
        .cloned()
        .collect();
    println!("짝수: {:?}", even_numbers);
    
    // 합계 계산
    let sum: i32 = numbers.iter().sum();
    println!("숫자의 합계: {}", sum);
}`,
  },
  cpp: {
    id: 'cpp',
    label: 'C++',
    logoPath: '/cpp.png',
    pistonRuntime: { language: 'cpp', version: '10.2.0' },
    monacoLanguage: 'cpp',
    defaultCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    // 벡터 생성
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    // 원래 숫자 출력
    std::cout << "원래 숫자: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << std::endl;
    
    // 제곱 계산
    std::vector<int> squares;
    std::transform(numbers.begin(), numbers.end(), 
                  std::back_inserter(squares),
                  [](int n) { return n * n; });
    
    std::cout << "제곱된 숫자: ";
    for (int n : squares) std::cout << n << " ";
    std::cout << std::endl;
    
    // 짝수 필터링
    std::cout << "짝수: ";
    for (int n : numbers) {
        if (n % 2 == 0) std::cout << n << " ";
    }
    std::cout << std::endl;
    
    // 합계 계산
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "숫자의 합계: " << sum << std::endl;
    
    return 0;
}`,
  },
  csharp: {
    id: 'csharp',
    label: 'C#',
    logoPath: '/csharp.png',
    pistonRuntime: { language: 'csharp', version: '6.12.0' },
    monacoLanguage: 'csharp',
    defaultCode: `using System;
using System.Linq;

class Program {
    static void Main() {
        // 배열 생성
        int[] numbers = { 1, 2, 3, 4, 5 };
        
        // 원래 숫자 출력
        Console.WriteLine($"원래 숫자: {string.Join(" ", numbers)}");
        
        // 제곱 계산
        var squares = numbers.Select(n => n * n);
        Console.WriteLine($"제곱된 숫자: {string.Join(" ", squares)}");
        
        // 짝수 필터링
        var evenNumbers = numbers.Where(n => n % 2 == 0);
        Console.WriteLine($"짝수: {string.Join(" ", evenNumbers)}");
        
        // 합계 계산
        var sum = numbers.Sum();
        Console.WriteLine($"숫자의 합계: {sum}");
    }
}`,
  },
  ruby: {
    id: 'ruby',
    label: '루비',
    logoPath: '/ruby.png',
    pistonRuntime: { language: 'ruby', version: '3.0.1' },
    monacoLanguage: 'ruby',
    defaultCode: `# 배열 생성
numbers = [1, 2, 3, 4, 5]

# 원래 숫자 출력
puts "원래 숫자: #{numbers.join(' ')}"

# 제곱 계산
squares = numbers.map { |n| n * n }
puts "제곱된 숫자: #{squares.join(' ')}"

# 짝수 필터링
even_numbers = numbers.select { |n| n.even? }
puts "짝수: #{even_numbers.join(' ')}"

# 합계 계산
sum = numbers.sum
puts "숫자의 합계: #{sum}"`,
  },
  swift: {
    id: 'swift',
    label: '스위프트',
    logoPath: '/swift.png',
    pistonRuntime: { language: 'swift', version: '5.3.3' },
    monacoLanguage: 'swift',
    defaultCode: `// 배열 생성
let numbers = [1, 2, 3, 4, 5]

// 원래 숫자 출력
print("원래 숫자: \\(numbers)")

// 제곱 계산
let squares = numbers.map { $0 * $0 }
print("제곱된 숫자: \\(squares)")

// 짝수 필터링
let evenNumbers = numbers.filter { $0 % 2 == 0 }
print("짝수: \\(evenNumbers)")

// 합계 계산
let sum = numbers.reduce(0, +)
print("숫자의 합계: \\(sum)")`,
  },
}

export const THEMES: Theme[] = [
  { id: 'vs-dark', label: 'VS 다크', color: '#1e1e1e' },
  { id: 'vs-light', label: 'VS 라이트', color: '#ffffff' },
  { id: 'github-dark', label: 'GitHub 다크', color: '#0d1117' },
  { id: 'monokai', label: 'Monokai', color: '#272822' },
  { id: 'solarized-dark', label: 'Solarized 다크', color: '#002b36' },
]

export const THEME_DEFINITONS = {
  'github-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6e7681' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'type', foreground: 'ffa657' },
      { token: 'class', foreground: 'ffa657' },
      { token: 'function', foreground: 'd2a8ff' },
      { token: 'variable', foreground: 'ffa657' },
      { token: 'operator', foreground: 'ff7b72' },
    ],
    colors: {
      'editor.background': '#0d1117',
      'editor.foreground': '#c9d1d9',
      'editor.lineHighlightBackground': '#161b22',
      'editorLineNumber.foreground': '#6e7681',
      'editorIndentGuide.background': '#21262d',
      'editor.selectionBackground': '#264f78',
      'editor.inactiveSelectionBackground': '#264f7855',
    },
  },
  monokai: {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '75715E' },
      { token: 'string', foreground: 'E6DB74' },
      { token: 'keyword', foreground: 'F92672' },
      { token: 'number', foreground: 'AE81FF' },
      { token: 'type', foreground: '66D9EF' },
      { token: 'class', foreground: 'A6E22E' },
      { token: 'function', foreground: 'A6E22E' },
      { token: 'variable', foreground: 'F8F8F2' },
      { token: 'operator', foreground: 'F92672' },
    ],
    colors: {
      'editor.background': '#272822',
      'editor.foreground': '#F8F8F2',
      'editorLineNumber.foreground': '#75715E',
      'editor.selectionBackground': '#49483E',
      'editor.lineHighlightBackground': '#3E3D32',
      'editorCursor.foreground': '#F8F8F2',
      'editor.selectionHighlightBackground': '#49483E',
    },
  },
  'solarized-dark': {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '586e75' },
      { token: 'string', foreground: '2aa198' },
      { token: 'keyword', foreground: '859900' },
      { token: 'number', foreground: 'd33682' },
      { token: 'type', foreground: 'b58900' },
      { token: 'class', foreground: 'b58900' },
      { token: 'function', foreground: '268bd2' },
      { token: 'variable', foreground: 'b58900' },
      { token: 'operator', foreground: '859900' },
    ],
    colors: {
      'editor.background': '#002b36',
      'editor.foreground': '#839496',
      'editorLineNumber.foreground': '#586e75',
      'editor.selectionBackground': '#073642',
      'editor.lineHighlightBackground': '#073642',
      'editorCursor.foreground': '#839496',
      'editor.selectionHighlightBackground': '#073642',
    },
  },
}

// Monaco에서 테마를 정의하는 도우미 함수
export const defineMonacoThemes = (monaco: Monaco) => {
  Object.entries(THEME_DEFINITONS).forEach(([themeName, themeData]) => {
    monaco.editor.defineTheme(themeName, {
      base: themeData.base,
      inherit: themeData.inherit,
      rules: themeData.rules.map((rule) => ({
        ...rule,
        foreground: rule.foreground,
      })),
      colors: themeData.colors,
    })
  })
}
