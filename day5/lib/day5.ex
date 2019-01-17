defmodule Day5 do

  def part1(polymer) do
    String.length(part1_str(polymer))
  end

  def part1_str(polymer) do
    chlist = String.to_charlist(polymer)
    new_chlist = react(chlist)
    to_string(new_chlist)
  end

  defp react(polymer, ignore \\ nil) do
    stack = polymer |> Enum.reduce([], fn x, stack ->
      if ignore && same_letter_ignore_case?(x, ignore) do
        stack
      else
        stack_head = if length(stack) == 0, do: nil, else: hd stack
        if stack_head && different_polarity?(stack_head, x) do
          tl stack
        else
          [x | stack]
        end
      end
    end)
    stack |> Enum.reverse()
  end

  defp different_polarity?(a, b), do: abs(a - b) == 32
  defp same_letter_ignore_case?(a, b), do: a == b || abs(a - b) == 32

  def part2(polymer) do
    chlist = String.to_charlist(polymer)
    unit_types = chlist |> Enum.map(fn u -> hd String.to_charlist(String.upcase(to_string([u]))) end) |> MapSet.new()
    lengths = unit_types |> Enum.map(fn u ->
      length(react(chlist, u))
    end)
    Enum.min(lengths)
  end
end
