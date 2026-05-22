When you put overflow: 'hidden' on a container that has rounded corners (borderRadius: '16px'), and then you animate its children using CSS transform (which GSAP is doing when it scales the svgRef), the browser's hardware acceleration gets confused and fails to actually clip the children, allowing them to bleed right past the rounded corners!

I just updated the code to fix this.

I removed the conflicting overflow-visible Tailwind class.
I kept overflow: 'hidden' but added transform: 'translateZ(0)' and isolation: 'isolate' to the card frame styles.