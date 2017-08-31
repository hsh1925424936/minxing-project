public class TestVariable{
	int c;//实例变量，成员变量，属性
	public static void main(String[] args){
		//局部变量
		int a = 3;
		//或者
		int b;
		b = 5;
		
		//位运算符
		int m = 8;
		int n = 4;
		System.out.println(m&n);
		System.out.println(m|n);
		System.out.println(m^n);
		System.out.println(~m);
		System.out.println(~n);
	}
}