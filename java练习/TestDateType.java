public class TestDateType{
	public static void main(String[] args){
		int a  = 10;
		int a2 = 010;//8����
		int a3 = 0xf;//16����
		System.out.println(a);
		System.out.println(a2);
		System.out.println(a3);
		//ת���ɶ�����
		System.out.println(Integer.toBinaryString(a));
		//ת���ɰ˽���
		System.out.println(Integer.toOctalString(a));
		//ת����ʮ������
		System.out.println(Integer.toHexString(a));
		
		double d = 3.14;//����������Ĭ����double;
		float f = 3.14F;//
		double d2 = 3.14e-2;
		System.out.println(d2);
		System.out.println(d == f);//�����������
		/*
		float f1 = 3.14;�����ݵ�����: ��doubleת����float���ܻ�����ʧ
		System.out.println(f1);
		*/
		char c = 'a';
		int i = c + 2;
		char c1 = (char)i;//ǿ��ת��
		System.out.println(c1);
		/*
		for(int j=0;j<26;j++){
			char temp = (char)(c + j);
			System.out.println(temp);
		}
		*/
		
		
		
	}
}