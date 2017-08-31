public class TestCast{
	public static void main(String[] args){
		//char 范围在0~65535
		//强制转型
		//int转换成char,超过char的表述范围，所以转换成一个完全无意的值
		/*
		int a = 100;
		char a1 = (char)a;
		System.out.println(a1);
		*/
		
		//表达式中的类型提升问题；
		/*
		int b = 10;
		int b1 = 1000000000;
		long b2 = (long)b*b1;
		System.out.println(b2);
		*/
		
		int c = 1_5268_8954;
		System.out.println(c);
		int c1 = 0b0000_0000_0000_0000_0000_0000_0000_1111;
		System.out.println(c1);
		byte c2 = 0b0001_1111;
		System.out.println(c2);
	}
}