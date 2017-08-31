public class TestDateType{
	public static void main(String[] args){
		int a  = 10;
		int a2 = 010;//8进制
		int a3 = 0xf;//16进制
		System.out.println(a);
		System.out.println(a2);
		System.out.println(a3);
		//
		System.out.println(Integer.toBinaryString(a));
		System.out.println(Integer.toOctalString(a));
		System.out.println(Integer.toHexString(a));
	}
}