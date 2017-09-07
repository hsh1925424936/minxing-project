package javaDemo;

public class Student {
	//静态的数据
	String name;
	int id;
	int age;
	String gender;
	int weight;
	//动态的行为
	public void study(){
		System.out.println(name+"在学习");
	}
	public void sayHello(String sname){
		System.out.println(name+"向"+sname+"说：你好！");
	}
	public static void main(String[] args){
//		通过类加载器Class Loader加载Student类；
		Student s1 = new Student();
		s1.name = "罗钊";
		s1.study();
		s1.sayHello("胡世豪");
	}
	
}
