public class TestDateType{
	public static void main(String[] args){
		int a  = 10;
		int a2 = 010;//8进制
		int a3 = 0xf;//16进制
		System.out.println(a);
		System.out.println(a2);
		System.out.println(a3);
		//转换成二进制
		System.out.println(Integer.toBinaryString(a));
		//转换成八进制
		System.out.println(Integer.toOctalString(a));
		//转换成十六进制
		System.out.println(Integer.toHexString(a));
		
		double d = 3.14;//浮点数常量默认是double;
		float f = 3.14F;//
		double d2 = 3.14e-2;
		System.out.println(d2);
		System.out.println(d == f);//浮点数有误差
		/*
		float f1 = 3.14;不兼容的类型: 从double转换到float可能会有损失
		System.out.println(f1);
		*/
		char c = 'a';
		int i = c + 2;
		char c1 = (char)i;//强制转型
		System.out.println(c1);
		/*
		for(int j=0;j<26;j++){
			char temp = (char)(c + j);
			System.out.println(temp);
		}
		*/
		
		
		
	}
}