public class TestCast{
	public static void main(String[] args){
		//char 范围在0~65535
		//强制转型
		//int转换成char,超过char的表述范围，所以转换成一个完全无意的值
		int a = 100;
		char a1 = (char)a;
		System.out.println(a1);
		
	}
}