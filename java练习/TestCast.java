public class TestCast{
	public static void main(String[] args){
		//char ��Χ��0~65535
		//ǿ��ת��
		//intת����char,����char�ı�����Χ������ת����һ����ȫ�����ֵ
		/*
		int a = 100;
		char a1 = (char)a;
		System.out.println(a1);
		*/
		
		//���ʽ�е������������⣻
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