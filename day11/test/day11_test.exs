defmodule Day11Test do
  use ExUnit.Case
  import ExProf.Macro
  doctest Day11

  test "power level" do
    assert Day11.power_level(3, 5, 8) == 4
    assert Day11.power_level(122, 79, 57) == -5
    assert Day11.power_level(217, 196, 39) == 0
    assert Day11.power_level(101, 153, 71) == 4
  end

  test "part 1 examples" do
    assert Day11.part1(18) == {33, 45, 29}
    assert Day11.part1(42) == {21, 61, 30}
  end

  test "part 1" do
    assert Day11.part1(2694) == {243, 38, 30}
  end

  defp test_power(a, b, size, serial) do
    left = elem(Day11.find_power_rec(a, b, size, serial, %{}), 0)
    right = elem(Day11.find_power(a, b, size, serial), 2)
    assert left == right, "#{a}, #{b}, #{size} => #{left} != #{right}"
  end

  test "checking" do
    test_power(1, 1, 1, 18)
    test_power(1, 1, 2, 18)
    test_power(1, 1, 3, 18)
    test_power(1, 1, 4, 18)
  end

  test "part 2 example 1" do
    assert Day11.part2(18) == {90, 269, 16, 113}
  end

  test "part 2 example 2" do
    assert Day11.part2(42) == {232, 251, 12, 119}
  end

  test "part 2" do
    assert Day11.part2(2694) == {235, 146, 13, 95} # 96??
  end
end
