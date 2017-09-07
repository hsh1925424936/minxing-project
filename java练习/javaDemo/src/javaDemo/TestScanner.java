package javaDemo;

import java.util.Scanner;
public class TestScanner {
	public static void main(String[] args){
//		键盘输入
		Scanner s = new Scanner(System.in);
		String str = s.next();
		System.out.println("刚才输入的是"+str);
	}
}
