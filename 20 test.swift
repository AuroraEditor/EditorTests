import SwiftUI

struct MyCustomView: View {
	@Binding var myVar: String
	@State var myState: Bool

	public init() {}
	var body: some View {
		VStack {
			Text("This is a test")
				.padding()

			Text("For SwiftUI")
				.padding()

           Text("OK")
		}
	}
}