package javaDemo;
//测试jdk7中switch特性
public class TestSwitch {
	public static void main(String[] args){
		String a = "hahaha";
		switch(a){//表达式结果可以是字符串
		case "hahaha":
			System.out.println("ok");
			break;
		default:
			System.out.println("error");
		}
	}
}
