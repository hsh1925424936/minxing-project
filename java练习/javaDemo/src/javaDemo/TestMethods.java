package javaDemo;
/**
 * 求质数的方法
 * @author 15236
 *
 */
public class TestMethods {
	/**
	 * 
	 * @param a
	 * @param b
	 */
	public static void test01(int a,int b){
		outer:for(int i=a;i<b;i++){
			for(int j = 2;j<=i/2;j++){
				if(i%j == 0){
					continue outer;
				}
			}
			System.out.println(i);
		}
	}
	public static void main(String[] args) {
		test01(10,100);
	}
}
