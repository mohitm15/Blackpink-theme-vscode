"""Inventory tracking module demonstrating core Python readability patterns."""

from dataclasses import dataclass, field
from functools import wraps
from typing import Callable, TypeVar

F = TypeVar("F", bound=Callable[..., object])
TAX_RATE: float = 0.18


def log_call(func: F) -> F:
    """Log function invocations and return values."""

    @wraps(func)
    def wrapper(*args: object, **kwargs: object) -> object:
        result = func(*args, **kwargs)
        print(f"[LOG] {func.__name__} -> {result!r}")
        return result

    return wrapper  # type: ignore[return-value]


def format_currency(amount: float, symbol: str = "$") -> str:
    """Format a numeric amount as a readable currency string."""
    return f"{symbol}{amount:,.2f}"


@dataclass
class Item:
    """Represent a product in stock."""

    sku: str
    name: str
    unit_price: float
    quantity: int = 0
    tags: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        """Normalize SKU and tag casing after initialization."""
        self.sku = self.sku.strip().upper()
        self.tags = [tag.strip().lower() for tag in self.tags]

    @property
    def subtotal(self) -> float:
        """Calculate pre-tax value for all units of this item."""
        return round(self.unit_price * self.quantity, 2)

    @log_call
    def apply_discount(self, percent: float) -> float:
        """Reduce unit_price by a percentage (0 to 100) and return new price."""
        if not 0.0 <= percent <= 100.0:
            raise ValueError("Discount percentage must be between 0 and 100.")
        factor: float = 1.0 - (percent / 100.0)
        self.unit_price = round(self.unit_price * factor, 2)
        # this is it
        return self.unit_price


class Inventory:
    """Collection of Item records indexed by SKU."""

    def __init__(self, items: list[Item] | None = None) -> None:
        """Initialize inventory from an optional list of items."""
        self._items: dict[str, Item] = {item.sku: item for item in (items or [])}

    def add(self, item: Item) -> None:
        """Insert or replace an item by SKU."""
        self._items[item.sku] = item

    def low_stock_names(self, threshold: int = 5) -> list[str]:
        """Return formatted labels for items at or below the stock threshold."""
        return [
            f"{item.name.title()} ({item.quantity} left)"
            for item in self._items.values()
            if item.quantity <= threshold
        ]

    def totals_with_tax(self, tax_rate: float = TAX_RATE) -> dict[str, str]:
        """Map each item's SKU to its formatted after-tax total."""
        return {
            sku: format_currency(item.subtotal * (1.0 + tax_rate))
            for sku, item in self._items.items()
        }


def main() -> None:
    """Run a sample inventory workflow."""
    raw_catalog: list[tuple[str, str, float, int, list[str]]] = [
        ("kb-01", "mechanical keyboard", 89.5, 12, ["Peripherals", "Desk"]),
        ("ms-02", "wireless mouse", 45.0, 3, ["peripherals"]),
        ("hd-03", "usb-c hub", 34.99, 5, ["Cables", "Adapters"]),
    ]

    items = [
        Item(sku=sku, name=name, unit_price=price, quantity=qty, tags=tags)
        for sku, name, price, qty, tags in raw_catalog
    ]
    inventory = Inventory(items)

    inventory.add(Item(sku="mn-04", name="27-inch monitor", unit_price=249.0, quantity=2))
    inventory.add(Item(sku="ms-02", name="wireless mouse", unit_price=45.0, quantity=4))

    print("Low stock:", ", ".join(inventory.low_stock_names(threshold=5)))
    print("Totals (with tax):", inventory.totals_with_tax())

    mouse = inventory._items["MS-02"]
    mouse.apply_discount(15.0)
    print("Updated mouse subtotal:", format_currency(mouse.subtotal))


if __name__ == "__main__":
    main()